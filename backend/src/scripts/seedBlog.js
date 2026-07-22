import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';
import dotenv   from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import Post from '../models/model/Post.js';
import User from '../models/model/User.js';

const ADMIN_EMAIL    = 'admin@bookwise.com';
const ADMIN_PASSWORD = 'Admin123!';

const posts = [
  { title: 'Cómo elegir tu próxima lectura', slug: 'como-elegir-tu-proxima-lectura', content: 'Elegir un libro puede ser abrumador con tantas opciones disponibles.\n\nAcá te dejamos algunas guías simples: pensá en el estado de ánimo que buscás, el tiempo que tenés disponible y si preferís ficción o no ficción.\n\nNo hay una fórmula mágica, pero animarse a explorar géneros nuevos siempre suma.', tags: ['recomendaciones', 'lectura'], published: true },
  { title: 'Reseña: Cien años de soledad', slug: 'resena-cien-anos-de-soledad', content: 'La obra maestra de García Márquez sigue siendo, décadas después, una puerta de entrada al realismo mágico latinoamericano.\n\nLa familia Buendía y el pueblo de Macondo condensan un siglo de historia, amor y soledad en una prosa inolvidable.', tags: ['reseña', 'ficción', 'clásicos'], published: true },
  { title: '5 hábitos de lectura que cambiarán tu año', slug: '5-habitos-de-lectura-que-cambiaran-tu-ano', content: 'Leer más no depende solo de las ganas, sino de construir hábitos sostenibles.\n\n1. Leé 10 minutos antes de dormir.\n2. Llevá siempre un libro con vos.\n3. Unite a un club de lectura.\n4. Llevá un registro de lo que leés.\n5. No tengas miedo de abandonar un libro que no te atrapa.', tags: ['hábitos', 'productividad'], published: true },
  { title: 'Entrevista: el proceso creativo detrás de un bestseller', slug: 'entrevista-proceso-creativo-bestseller', content: 'Conversamos con autores sobre cómo nace una historia, desde la primera idea hasta la publicación.\n\nUn proceso que mezcla disciplina, intuición y muchísima reescritura.', tags: ['entrevista', 'autores'], published: true },
  { title: 'Los mejores libros de ciencia ficción de la última década', slug: 'mejores-libros-ciencia-ficcion-decada', content: 'La ciencia ficción contemporánea sigue reinventándose.\n\nDesde distopías climáticas hasta space operas, repasamos las obras más influyentes de los últimos diez años.', tags: ['ciencia-ficción', 'recomendaciones'], published: true },
  { title: 'Por qué la poesía sigue siendo relevante', slug: 'por-que-la-poesia-sigue-siendo-relevante', content: 'En un mundo acelerado, la poesía ofrece una pausa necesaria.\n\nSu capacidad de condensar emociones complejas en pocas palabras la vuelve tan vigente como siempre.', tags: ['poesía', 'reflexión'], published: true },
  { title: 'Guía para armar tu club de lectura', slug: 'guia-para-armar-tu-club-de-lectura', content: 'Un club de lectura es una excelente forma de socializar en torno a los libros.\n\nTe contamos cómo elegir el primer título, organizar los encuentros y mantener el interés del grupo con el tiempo.', tags: ['comunidad', 'lectura'], published: true },
  { title: 'El auge de los audiolibros', slug: 'el-auge-de-los-audiolibros', content: 'Cada vez más lectores incorporan los audiolibros a su rutina diaria.\n\nAnalizamos por qué este formato ganó tanta popularidad y cómo elegir una buena narración.', tags: ['audiolibros', 'tendencias'], published: true },
  { title: 'Libros de desarrollo personal que realmente funcionan', slug: 'libros-desarrollo-personal-que-funcionan', content: 'No todos los libros de autoayuda están hechos igual.\n\nSeleccionamos algunos que combinan evidencia científica con consejos prácticos y aplicables.', tags: ['desarrollo-personal'], published: true },
  { title: 'Cómo la tecnología está cambiando la forma de leer', slug: 'tecnologia-cambiando-forma-de-leer', content: 'Ebooks, apps de lectura social y recomendaciones por IA: el ecosistema lector se transforma constantemente.\n\nExploramos las tendencias que definen el futuro cercano.', tags: ['tecnología', 'ebooks'], published: true },

  // ── Borradores (para probar bulk publish) ──
  { title: '[Borrador] Reseña: Sapiens', slug: 'borrador-resena-sapiens', content: 'Notas preliminares sobre el libro de Yuval Noah Harari — completar antes de publicar.', tags: ['reseña', 'no-ficción'], published: false },
  { title: '[Borrador] Top 10 libros infantiles del año', slug: 'borrador-top-10-libros-infantiles', content: 'Lista en construcción, falta confirmar el orden final y agregar imágenes.', tags: ['infantil', 'recomendaciones'], published: false },
  { title: '[Borrador] Novedades editoriales de la temporada', slug: 'borrador-novedades-editoriales-temporada', content: 'Borrador con lanzamientos próximos — pendiente de confirmar fechas con las editoriales.', tags: ['novedades'], published: false },
  { title: '[Borrador] Entrevista pendiente de edición', slug: 'borrador-entrevista-pendiente-edicion', content: 'Transcripción cruda de la entrevista, falta editar y agregar preguntas de seguimiento.', tags: ['entrevista'], published: false },
  { title: '[Borrador] Guía de regalos literarios', slug: 'borrador-guia-regalos-literarios', content: 'Ideas de regalos para lectores según género favorito — falta revisar precios actualizados.', tags: ['guía', 'recomendaciones'], published: false },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    /* ── Admin: buscar o crear (nunca se borran usuarios existentes) ── */
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      admin = await User.create({
        username: 'admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
      });
      console.log(`👤 Admin creado → ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    } else {
      console.log(`👤 Admin ya existía → ${ADMIN_EMAIL} (reutilizado como autor)`);
    }

    const baselineSlugs = posts.map((p) => p.slug);
    const baselineBySlug = new Map(posts.map((p) => [p.slug, p]));

    // Arma el objeto "canónico" completo de un post del blog base — con
    // defaults explícitos, igual que toBaselineDoc en seedProducts.js.
    const toBaselinePost = (entry) => ({
      title:             entry.title,
      content:           entry.content,
      slug:              entry.slug,
      tags:              entry.tags ?? [],
      thumbnail:         entry.thumbnail ?? '',
      thumbnailPublicId: '',
      published:         entry.published ?? false,
      author:            admin._id,
    });

    /* ── 1. Borrar posts inventados por la cuenta demo ───────────────────────
       Un post "inventado" es uno cuyo slug no pertenece al blog base — solo
       puede haberlo creado un admin (real o demo) a mano. Si lo tocó por
       última vez la cuenta demo, es basura de un visitante probando el
       panel: se borra. Si lo tocó el admin real, se conserva. */
    const demoExtras = await Post.find({
      slug: { $nin: baselineSlugs },
      'lastEditedBy.isDemo': true,
    }).select('_id thumbnailPublicId');

    if (demoExtras.length) {
      const { deleteImage } = await import('../services/cloudinary.service.js');
      await Promise.all(
        demoExtras
          .filter((p) => p.thumbnailPublicId)
          .map((p) => deleteImage(p.thumbnailPublicId).catch(() => {}))
      );
      await Post.deleteMany({ _id: { $in: demoExtras.map((p) => p._id) } });
    }
    console.log(`🗑  ${demoExtras.length} post(s) creados por la cuenta demo eliminados`);

    /* ── 2. Restaurar posts del blog base "vandalizados" por demo ───────────
       Si un post SÍ pertenece al blog base pero la cuenta demo fue la
       última en editarlo, se resetean sus campos a la versión original.
       Si la última edición fue del admin real (o nunca se editó), no se
       toca — ahí es donde vive lo que vos escribís de verdad. */
    const vandalized = await Post.find({
      slug: { $in: baselineSlugs },
      'lastEditedBy.isDemo': true,
    });

    for (const doc of vandalized) {
      // Si el admin real ya había guardado una versión de este post,
      // volvemos ahí (no al blog base) — así no se pierde lo que escribiste
      // de verdad por culpa de un visitante editando con la cuenta demo después.
      const restoreTo = doc.lastRealSnapshot
        ? { ...doc.lastRealSnapshot }
        : toBaselinePost(baselineBySlug.get(doc.slug));

      Object.assign(doc, restoreTo, {
        lastEditedBy:     { userId: null, isDemo: false },
        lastRealSnapshot: restoreTo,
      });
      await doc.save({ validateBeforeSave: true });
    }
    console.log(`♻️  ${vandalized.length} post(s) restaurados a su última versión real (no al blog base, si el admin ya lo había personalizado)`);

    /* ── 3. Insertar del blog base lo que todavía no existe ─────────────────
       Solo pasa la primera vez (DB vacía) o si se agregó un post nuevo al
       array de arriba. Si el admin real borró un post del blog base a
       propósito, NO se reinserta acá — se respeta esa decisión. */
    const existingSlugs = new Set(await Post.distinct('slug'));
    const missing = posts.filter((p) => !existingSlugs.has(p.slug));

    if (missing.length) {
      const missingWithAuthor = missing.map((p) => ({
        ...p,
        author: admin._id,
        lastRealSnapshot: toBaselinePost(p),
      }));
      await Post.insertMany(missingWithAuthor, { ordered: false });
    }
    console.log(`📝 ${missing.length} post(s) del blog base insertados por primera vez`);

    console.log('\n🎉 Reseed selectivo del blog completado con éxito\n');

  } catch (err) {
    if (err.code === 11000) {
      console.error('⚠️  Clave duplicada:', err.keyValue);
    } else {
      console.error('❌ Error en seed:', err.message);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

seed();