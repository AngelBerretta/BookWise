/**
 * Limpieza de imágenes huérfanas en Cloudinary.
 *
 * Recorre las carpetas bookwise/products y bookwise/blog en Cloudinary,
 * las cruza contra los thumbnailPublicId que realmente están guardados
 * en MongoDB (Product / Post), y reporta (o borra) todo lo que sobra:
 * imágenes que se subieron en algún momento (por ediciones canceladas,
 * cambios de imagen antes de guardar, etc.) pero que ningún producto o
 * post termina referenciando.
 *
 * Uso:
 *   npm run cleanup:images              → dry-run, solo lista lo que borraría
 *   npm run cleanup:images -- --confirm → borra de verdad
 *
 * Por defecto SIEMPRE es dry-run. Hace falta pasar --confirm explícito
 * para que borre algo — es una acción irreversible.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import minimist from 'minimist';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

const args = minimist(process.argv.slice(2));
const CONFIRM = args.confirm === true;

const { cloudinary, isCloudinaryConfigured } = await import('../services/cloudinary.service.js');
const { default: Product } = await import('../models/model/Product.js');
const { default: Post }    = await import('../models/model/Post.js');

// folder de Cloudinary → { label, modelo, campo con el public_id }
const TARGETS = [
  { folder: 'bookwise/products', label: 'Productos', Model: Product },
  { folder: 'bookwise/blog',     label: 'Posts',      Model: Post    },
];

/** Trae TODOS los public_id de una carpeta de Cloudinary, paginando. */
const listAllPublicIds = async (folder) => {
  const resources = [];
  let nextCursor;

  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: `${folder}/`,
      max_results: 500,
      next_cursor: nextCursor,
    });
    resources.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);

  return resources;
};

/** Borra public_ids de Cloudinary en tandas de 100 (límite de la API). */
const deleteInBatches = async (publicIds) => {
  const CHUNK = 100;
  let deleted = 0;

  for (let i = 0; i < publicIds.length; i += CHUNK) {
    const chunk = publicIds.slice(i, i + CHUNK);
    const res = await cloudinary.api.delete_resources(chunk);
    deleted += Object.values(res.deleted).filter((v) => v === 'deleted').length;
  }

  return deleted;
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const run = async () => {
  if (!isCloudinaryConfigured) {
    console.error('❌ Cloudinary no está configurado (revisá las env vars).');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
    console.log(CONFIRM
      ? '⚠️  Modo BORRADO (--confirm) — esto es irreversible.\n'
      : '🔎 Modo dry-run — no se borra nada, solo se lista.\n');

    let totalOrphans = 0;
    let totalBytes   = 0;

    for (const { folder, label, Model } of TARGETS) {
      const [cloudResources, dbDocs] = await Promise.all([
        listAllPublicIds(folder),
        Model.find({ thumbnailPublicId: { $ne: '' } }, 'thumbnailPublicId').lean(),
      ]);

      const usedIds = new Set(dbDocs.map((d) => d.thumbnailPublicId).filter(Boolean));
      const orphans = cloudResources.filter((r) => !usedIds.has(r.public_id));

      console.log(`── ${label} (${folder}) ──`);
      console.log(`   En Cloudinary: ${cloudResources.length}   Referenciadas en DB: ${usedIds.size}   Huérfanas: ${orphans.length}`);

      if (orphans.length) {
        orphans.forEach((o) => {
          console.log(`   🗑  ${o.public_id}  (${formatBytes(o.bytes)}, subida ${new Date(o.created_at).toLocaleDateString('es-AR')})`);
        });

        totalOrphans += orphans.length;
        totalBytes   += orphans.reduce((sum, o) => sum + o.bytes, 0);

        if (CONFIRM) {
          const deleted = await deleteInBatches(orphans.map((o) => o.public_id));
          console.log(`   ✅ ${deleted} imágenes borradas de Cloudinary.\n`);
        } else {
          console.log('');
        }
      } else {
        console.log('   Nada para limpiar acá.\n');
      }
    }

    console.log('────────────────────────────────────────');
    console.log(`Total huérfanas encontradas: ${totalOrphans}  (${formatBytes(totalBytes)})`);
    if (totalOrphans && !CONFIRM) {
      console.log('\nEsto fue un dry-run — no se borró nada.');
      console.log('Para borrar de verdad: npm run cleanup:images -- --confirm');
    }

  } catch (err) {
    console.error('❌ Error durante la limpieza:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

run();
