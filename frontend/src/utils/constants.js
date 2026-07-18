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
