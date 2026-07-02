import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import Product from '../models/model/Product.js';

const products = [
  {
    title:       'El Aleph',
    description: 'Una colección de cuentos fantásticos que exploran el tiempo, el espacio y la identidad. Incluye el célebre relato sobre un punto del universo que contiene todos los puntos.',
    code:        'FIC-001',
    price:       1800,
    status:      true,
    stock:       5,
    category:    'ficcion',
    author:      'Jorge Luis Borges',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       '1984',
    description: 'Una novela distópica ambientada en un estado totalitario donde el Gran Hermano vigila cada movimiento. Un clásico sobre el poder, la vigilancia y la libertad.',
    code:        'FIC-002',
    price:       1900,
    status:      true,
    stock:       10,
    category:    'ficcion',
    author:      'George Orwell',
    thumbnails:  ['https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg'],
    url:         '',
  },
  {
    title:       'Sapiens',
    description: 'Un recorrido fascinante por la historia de la humanidad, desde los primeros homínidos hasta la era moderna. Explora cómo el Homo sapiens conquistó el mundo.',
    code:        'NF-001',
    price:       2800,
    status:      true,
    stock:       8,
    category:    'no-ficcion',
    author:      'Yuval Noah Harari',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Educated',
    description: 'Las memorias de una mujer que creció en una familia survivalist en Idaho y no fue a la escuela hasta los 17 años, pero logró obtener un doctorado en Cambridge.',
    code:        'NF-002',
    price:       2600,
    status:      true,
    stock:       6,
    category:    'no-ficcion',
    author:      'Tara Westover',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Clean Code',
    description: 'Una guía práctica para escribir código limpio, legible y mantenible. Incluye principios, patrones y prácticas esenciales para todo desarrollador profesional.',
    code:        'CT-001',
    price:       3000,
    status:      true,
    stock:       12,
    category:    'ciencia-tecnologia',
    author:      'Robert C. Martin',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Introducción a la Inteligencia Artificial',
    description: 'Una introducción accesible a los conceptos fundamentales de la inteligencia artificial, machine learning y redes neuronales para principiantes y profesionales.',
    code:        'CT-002',
    price:       3200,
    status:      true,
    stock:       7,
    category:    'ciencia-tecnologia',
    author:      'Stuart Russell',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Hábitos Atómicos',
    description: 'Un método comprobado para adquirir buenos hábitos y eliminar los malos. Pequeños cambios que generan resultados extraordinarios a largo plazo.',
    code:        'DP-001',
    price:       2700,
    status:      true,
    stock:       15,
    category:    'desarrollo-personal',
    author:      'James Clear',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'El poder del ahora',
    description: 'Una guía espiritual que invita a vivir plenamente el momento presente, liberarse del ego y encontrar la paz interior a través de la consciencia.',
    code:        'DP-002',
    price:       2500,
    status:      true,
    stock:       9,
    category:    'desarrollo-personal',
    author:      'Eckhart Tolle',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Harry Potter y la piedra filosofal',
    description: 'El inicio de la saga más vendida de la historia. Harry Potter descubre que es un mago y comienza su aventura en Hogwarts, la escuela de magia y hechicería.',
    code:        'IJ-001',
    price:       2600,
    status:      true,
    stock:       20,
    category:    'infantil-juvenil',
    author:      'J.K. Rowling',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'El Principito',
    description: 'Un clásico de la literatura universal que narra el viaje de un pequeño príncipe por diferentes planetas. Una historia sobre la amistad, el amor y la esencia de la vida.',
    code:        'IJ-002',
    price:       2000,
    status:      true,
    stock:       18,
    category:    'infantil-juvenil',
    author:      'Antoine de Saint-Exupéry',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Veinte poemas de amor y una canción desesperada',
    description: 'Una de las obras más leídas en lengua española. Poemas apasionados que exploran el amor, la pérdida y el deseo con una prosa poética inigualable.',
    code:        'POE-001',
    price:       1700,
    status:      true,
    stock:       11,
    category:    'poesia',
    author:      'Pablo Neruda',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Antología poética universal',
    description: 'Una cuidadosa selección de los poemas más influyentes de la historia de la literatura, desde la Antigua Grecia hasta el siglo XX.',
    code:        'POE-002',
    price:       1600,
    status:      true,
    stock:       13,
    category:    'poesia',
    author:      'Varios autores',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Curso de JavaScript (eBook)',
    description: 'Aprendé JavaScript desde cero hasta nivel avanzado. Incluye ES6+, promesas, async/await, DOM, y proyectos prácticos para consolidar el aprendizaje.',
    code:        'EBOOK-001',
    price:       1500,
    status:      true,
    stock:       999,
    category:    'ebooks',
    author:      'BookWise Editorial',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'Guía de React (eBook)',
    description: 'Desarrollo frontend moderno con React 18. Hooks, Context API, React Router, performance y patrones avanzados explicados con ejemplos reales.',
    code:        'EBOOK-002',
    price:       1800,
    status:      true,
    stock:       999,
    category:    'ebooks',
    author:      'BookWise Editorial',
    thumbnails:  [],
    url:         '',
  },
  {
    title:       'El código Da Vinci',
    description: 'Un thriller de suspenso que sigue al profesor Robert Langdon en una investigación sobre un asesinato en el Louvre que esconde siglos de secretos religiosos.',
    code:        'FIC-003',
    price:       2100,
    status:      true,
    stock:       10,
    category:    'ficcion',
    author:      'Dan Brown',
    thumbnails:  [],
    url:         '',
  },
];

const seed = async () => {
  try {
    /* ── Conexión ── */
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    /* ── Limpieza selectiva (solo los codes del seed) ── */
    const codes   = products.map(p => p.code);
    const deleted = await Product.deleteMany({ code: { $in: codes } });
    console.log(`🗑  ${deleted.deletedCount} productos anteriores eliminados`);

    /* ── Inserción ── */
    const inserted = await Product.insertMany(products, { ordered: false });
    console.log(`\n📚 ${inserted.length} productos insertados:\n`);

    // Tabla en consola
    inserted.forEach(p =>
      console.log(`   ✔ [${p.code.padEnd(10)}] ${p.title}`)
    );

    console.log('\n🎉 Seed completado con éxito\n');

  } catch (err) {
    /* Error de clave duplicada (code unique) — informa sin crashear */
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