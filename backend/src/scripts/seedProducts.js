import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import Product from '../models/model/Product.js';

const products = [
  // ── Ficción ──
  { title: 'El Aleph', description: 'Una colección de cuentos fantásticos que exploran el tiempo, el espacio y la identidad. Incluye el célebre relato sobre un punto del universo que contiene todos los puntos.', code: 'FIC-001', price: 1800, status: true, stock: 5, category: 'ficcion', author: 'Jorge Luis Borges', thumbnails: [], url: '' },
  { title: '1984', description: 'Una novela distópica ambientada en un estado totalitario donde el Gran Hermano vigila cada movimiento. Un clásico sobre el poder, la vigilancia y la libertad.', code: 'FIC-002', price: 1900, status: true, stock: 10, category: 'ficcion', author: 'George Orwell', thumbnails: ['https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg'], url: '', pages: 328, publicationDate: '1949' },
  { title: 'El código Da Vinci', description: 'Un thriller de suspenso que sigue al profesor Robert Langdon en una investigación sobre un asesinato en el Louvre que esconde siglos de secretos religiosos.', code: 'FIC-003', price: 2100, status: true, stock: 10, category: 'ficcion', author: 'Dan Brown', thumbnails: [], url: '' },
  { title: 'Cien años de soledad', description: 'La historia de la familia Buendía a lo largo de siete generaciones en el mítico pueblo de Macondo. Obra cumbre del realismo mágico latinoamericano.', code: 'FIC-004', price: 2300, status: true, stock: 14, category: 'ficcion', author: 'Gabriel García Márquez', thumbnails: [], url: '', pages: 471, publicationDate: '1967' },
  { title: 'Rayuela', description: 'Una novela experimental que puede leerse en distintos órdenes, explorando el amor y la existencia entre París y Buenos Aires.', code: 'FIC-005', price: 2200, status: true, stock: 0, category: 'ficcion', author: 'Julio Cortázar', thumbnails: [], url: '' },
  { title: 'Fahrenheit 451', description: 'En un futuro donde los libros están prohibidos y los bomberos los queman, un hombre comienza a cuestionar su realidad.', code: 'FIC-006', price: 1950, status: true, stock: 8, category: 'ficcion', author: 'Ray Bradbury', thumbnails: [], url: '' },

  // ── No ficción ──
  { title: 'Sapiens', description: 'Un recorrido fascinante por la historia de la humanidad, desde los primeros homínidos hasta la era moderna. Explora cómo el Homo sapiens conquistó el mundo.', code: 'NF-001', price: 2800, status: true, stock: 8, category: 'no-ficcion', author: 'Yuval Noah Harari', thumbnails: [], url: '' },
  { title: 'Educated', description: 'Las memorias de una mujer que creció en una familia survivalist en Idaho y no fue a la escuela hasta los 17 años, pero logró obtener un doctorado en Cambridge.', code: 'NF-002', price: 2600, status: true, stock: 6, category: 'no-ficcion', author: 'Tara Westover', thumbnails: [], url: '' },
  { title: 'Una breve historia de casi todo', description: 'Un viaje ameno por la ciencia, desde el Big Bang hasta la evolución humana, explicado con humor y claridad.', code: 'NF-003', price: 2900, status: true, stock: 5, category: 'no-ficcion', author: 'Bill Bryson', thumbnails: [], url: '' },
  { title: 'El cisne negro', description: 'Un ensayo sobre el impacto de lo altamente improbable en la historia, la economía y la vida cotidiana.', code: 'NF-004', price: 2750, status: true, stock: 4, category: 'no-ficcion', author: 'Nassim N. Taleb', thumbnails: [], url: '' },

  // ── Ciencia y tecnología ──
  { title: 'Clean Code', description: 'Una guía práctica para escribir código limpio, legible y mantenible. Incluye principios, patrones y prácticas esenciales para todo desarrollador profesional.', code: 'CT-001', price: 3000, status: true, stock: 12, category: 'ciencia-tecnologia', author: 'Robert C. Martin', thumbnails: [], url: '' },
  { title: 'Introducción a la Inteligencia Artificial', description: 'Una introducción accesible a los conceptos fundamentales de la inteligencia artificial, machine learning y redes neuronales para principiantes y profesionales.', code: 'CT-002', price: 3200, status: true, stock: 7, category: 'ciencia-tecnologia', author: 'Stuart Russell', thumbnails: [], url: '' },
  { title: 'Breve historia del tiempo', description: 'Stephen Hawking explica los misterios del universo, los agujeros negros y el origen del tiempo con un lenguaje accesible.', code: 'CT-003', price: 2400, status: true, stock: 9, category: 'ciencia-tecnologia', author: 'Stephen Hawking', thumbnails: [], url: '' },
  { title: 'Refactoring', description: 'Técnicas para mejorar el diseño de código existente sin alterar su comportamiento externo. Un clásico de la ingeniería de software.', code: 'CT-004', price: 3400, status: true, stock: 3, category: 'ciencia-tecnologia', author: 'Martin Fowler', thumbnails: [], url: '' },

  // ── Desarrollo personal ──
  { title: 'Hábitos Atómicos', description: 'Un método comprobado para adquirir buenos hábitos y eliminar los malos. Pequeños cambios que generan resultados extraordinarios a largo plazo.', code: 'DP-001', price: 2700, status: true, stock: 15, category: 'desarrollo-personal', author: 'James Clear', thumbnails: [], url: '' },
  { title: 'El poder del ahora', description: 'Una guía espiritual que invita a vivir plenamente el momento presente, liberarse del ego y encontrar la paz interior a través de la consciencia.', code: 'DP-002', price: 2500, status: true, stock: 9, category: 'desarrollo-personal', author: 'Eckhart Tolle', thumbnails: [], url: '' },
  { title: 'Mindset: La actitud del éxito', description: 'La psicóloga Carol Dweck explica cómo la mentalidad de crecimiento puede transformar el aprendizaje y el desempeño.', code: 'DP-003', price: 2450, status: true, stock: 11, category: 'desarrollo-personal', author: 'Carol S. Dweck', thumbnails: [], url: '' },
  { title: 'Los 7 hábitos de la gente altamente efectiva', description: 'Un marco práctico de principios para la efectividad personal e interpersonal, aplicable a la vida y al trabajo.', code: 'DP-004', price: 2650, status: true, stock: 0, category: 'desarrollo-personal', author: 'Stephen R. Covey', thumbnails: [], url: '' },

  // ── Infantil y juvenil ──
  { title: 'Harry Potter y la piedra filosofal', description: 'El inicio de la saga más vendida de la historia. Harry Potter descubre que es un mago y comienza su aventura en Hogwarts, la escuela de magia y hechicería.', code: 'IJ-001', price: 2600, status: true, stock: 20, category: 'infantil-juvenil', author: 'J.K. Rowling', thumbnails: [], url: '', pages: 223, publicationDate: '1997' },
  { title: 'El Principito', description: 'Un clásico de la literatura universal que narra el viaje de un pequeño príncipe por diferentes planetas. Una historia sobre la amistad, el amor y la esencia de la vida.', code: 'IJ-002', price: 2000, status: true, stock: 18, category: 'infantil-juvenil', author: 'Antoine de Saint-Exupéry', thumbnails: [], url: '' },
  { title: 'Matilda', description: 'La historia de una niña extraordinaria con poderes especiales que enfrenta a los adultos injustos de su vida con astucia e inteligencia.', code: 'IJ-003', price: 1950, status: true, stock: 16, category: 'infantil-juvenil', author: 'Roald Dahl', thumbnails: [], url: '' },
  { title: 'Las crónicas de Narnia', description: 'Un grupo de hermanos descubre un mundo mágico a través de un armario, donde deberán enfrentar a la Bruja Blanca junto al león Aslan.', code: 'IJ-004', price: 2150, status: true, stock: 12, category: 'infantil-juvenil', author: 'C.S. Lewis', thumbnails: [], url: '' },

  // ── Poesía ──
  { title: 'Veinte poemas de amor y una canción desesperada', description: 'Una de las obras más leídas en lengua española. Poemas apasionados que exploran el amor, la pérdida y el deseo con una prosa poética inigualable.', code: 'POE-001', price: 1700, status: true, stock: 11, category: 'poesia', author: 'Pablo Neruda', thumbnails: [], url: '' },
  { title: 'Antología poética universal', description: 'Una cuidadosa selección de los poemas más influyentes de la historia de la literatura, desde la Antigua Grecia hasta el siglo XX.', code: 'POE-002', price: 1600, status: true, stock: 13, category: 'poesia', author: 'Varios autores', thumbnails: [], url: '' },
  { title: 'Hojas de hierba', description: 'La obra maestra de Walt Whitman, un canto a la individualidad, la naturaleza y la democracia estadounidense.', code: 'POE-003', price: 1750, status: true, stock: 6, category: 'poesia', author: 'Walt Whitman', thumbnails: [], url: '' },

  // ── Ebooks ──
  { title: 'Curso de JavaScript (eBook)', description: 'Aprendé JavaScript desde cero hasta nivel avanzado. Incluye ES6+, promesas, async/await, DOM, y proyectos prácticos para consolidar el aprendizaje.', code: 'EBOOK-001', price: 1500, status: true, stock: 999, category: 'ebooks', author: 'BookWise Editorial', thumbnails: [], url: '' },
  { title: 'Guía de React (eBook)', description: 'Desarrollo frontend moderno con React 18. Hooks, Context API, React Router, performance y patrones avanzados explicados con ejemplos reales.', code: 'EBOOK-002', price: 1800, status: true, stock: 999, category: 'ebooks', author: 'BookWise Editorial', thumbnails: [], url: '' },
  { title: 'Node.js desde cero (eBook)', description: 'Backend con Node.js y Express: rutas, middlewares, autenticación con JWT, bases de datos y buenas prácticas de arquitectura.', code: 'EBOOK-003', price: 1700, status: true, stock: 999, category: 'ebooks', author: 'BookWise Editorial', thumbnails: [], url: '' },
  { title: 'MongoDB práctico (eBook)', description: 'Modelado de datos, agregaciones, índices y rendimiento en MongoDB para aplicaciones del mundo real.', code: 'EBOOK-004', price: 1650, status: true, stock: 999, category: 'ebooks', author: 'BookWise Editorial', thumbnails: [], url: '' },

  // ── Extra spread de precios (para probar filtro/orden de precio) ──
  { title: 'Meditaciones', description: 'Las reflexiones filosóficas del emperador romano Marco Aurelio sobre la virtud, el deber y la aceptación estoica de la vida.', code: 'FIC-007', price: 4200, status: true, stock: 3, category: 'ficcion', author: 'Marco Aurelio', thumbnails: [], url: '' },
  { title: 'El arte de la guerra', description: 'El tratado militar más antiguo e influyente del mundo, aplicado hoy a los negocios, la estrategia y el liderazgo.', code: 'NF-005', price: 1200, status: true, stock: 25, category: 'no-ficcion', author: 'Sun Tzu', thumbnails: [], url: '' },
];

const seed = async () => {
  try {
    /* ── Conexión ── */
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const baselineCodes = products.map((p) => p.code);
    const baselineByCode = new Map(products.map((p) => [p.code, p]));

    // Arma el objeto "canónico" completo de un producto del catálogo base,
    // con defaults explícitos para los campos que el literal no siempre trae
    // (pages, publicationDate, thumbnailPublicId). Necesario porque un simple
    // Object.assign(doc, baseline) NO resetea claves ausentes en `baseline`
    // — dejaría colgado cualquier valor que la cuenta demo haya seteado ahí.
    const toBaselineDoc = (entry) => ({
      title:             entry.title,
      description:       entry.description,
      code:              entry.code,
      price:             entry.price,
      status:            entry.status,
      stock:             entry.stock,
      category:          entry.category,
      thumbnails:        entry.thumbnails ?? [],
      thumbnailPublicId: '',
      url:               entry.url ?? '',
      author:            entry.author ?? '',
      pages:             entry.pages ?? null,
      publicationDate:   entry.publicationDate ?? null,
    });

    /* ── 1. Borrar productos inventados por la cuenta demo ──────────────────
       Un producto "inventado" es uno cuyo código no pertenece al catálogo
       base — solo puede haberlo creado un admin (real o demo) a mano.
       Si lo creó o lo tocó por última vez la cuenta demo, es basura de un
       visitante probando el panel: se borra. Si lo tocó el admin real, se
       conserva sin importar qué sea. */
    const demoExtras = await Product.find({
      code: { $nin: baselineCodes },
      'lastEditedBy.isDemo': true,
    }).select('_id thumbnailPublicId');

    if (demoExtras.length) {
      const { deleteImage } = await import('../services/cloudinary.service.js');
      await Promise.all(
        demoExtras
          .filter((p) => p.thumbnailPublicId)
          .map((p) => deleteImage(p.thumbnailPublicId).catch(() => {}))
      );
      await Product.deleteMany({ _id: { $in: demoExtras.map((p) => p._id) } });
    }
    console.log(`🗑  ${demoExtras.length} producto(s) creados por la cuenta demo eliminados`);

    /* ── 2. Restaurar productos del catálogo base "vandalizados" por demo ───
       Si un producto SÍ pertenece al catálogo base pero la cuenta demo fue
       la última en editarlo, se resetean sus campos a la versión original.
       Si la última edición fue del admin real (o nunca se editó), no se
       toca — ahí es donde viven tus imágenes subidas a mano. */
    const vandalized = await Product.find({
      code: { $in: baselineCodes },
      'lastEditedBy.isDemo': true,
    });

    for (const doc of vandalized) {
      const baseline = toBaselineDoc(baselineByCode.get(doc.code));
      Object.assign(doc, baseline, {
        createdBy:    { userId: null, isDemo: false },
        lastEditedBy: { userId: null, isDemo: false },
      });
      await doc.save({ validateBeforeSave: true });
    }
    console.log(`♻️  ${vandalized.length} producto(s) del catálogo restaurados (editados por la cuenta demo)`);

    /* ── 3. Insertar del catálogo base lo que todavía no existe ─────────────
       Solo pasa la primera vez (DB vacía) o si se agregó un libro nuevo al
       array de arriba. Si el admin real borró un producto del catálogo a
       propósito, NO se reinserta acá — se respeta esa decisión. */
    const existingCodes = new Set(await Product.distinct('code'));
    const missing = products.filter((p) => !existingCodes.has(p.code));

    if (missing.length) {
      await Product.insertMany(missing, { ordered: false });
    }
    console.log(`📚 ${missing.length} producto(s) del catálogo base insertados por primera vez`);

    console.log('\n🎉 Reseed selectivo completado con éxito\n');

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