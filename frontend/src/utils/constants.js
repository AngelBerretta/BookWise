// Constantes globales de la aplicación

export const NAV_LINKS = [
  { to: '/',         label: 'Inicio',    exact: true },
  { to: '/products', label: 'Productos' },
  { to: '/blog',     label: 'Blog' },
];

export const PRODUCT_CATEGORIES = [
  { value: 'ficcion', label: 'Ficción' },
  { value: 'no-ficcion', label: 'No Ficción' },
  { value: 'ciencia-tecnologia', label: 'Ciencia y Tecnología' },
  { value: 'desarrollo-personal', label: 'Desarrollo Personal' },
  { value: 'infantil-juvenil', label: 'Infantil y Juvenil' },
  { value: 'poesia', label: 'Poesía' },
  { value: 'ebooks', label: 'E-books' }
];

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/* Paleta de colores por categoría — par bg/text (con variantes dark:).
   Fuente única de verdad compartida por Badge.jsx (catálogo) y Home.jsx
   (tarjetas de categoría), para que ambos usen siempre los mismos colores. */
export const CATEGORY_COLORS = {
  'ficcion':             'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'no-ficcion':          'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'ciencia-tecnologia':  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'desarrollo-personal': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'infantil-juvenil':    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'poesia':              'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'ebooks':              'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};
