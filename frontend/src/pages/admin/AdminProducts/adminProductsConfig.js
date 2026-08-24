export const PAGE_SIZE = 10;
export const checkboxCls = 'w-4 h-4 rounded cursor-pointer accent-[var(--accent)]';

export const STOCK_OPTIONS = [
  { value: 'out', label: 'Sin stock' },
  { value: 'low', label: 'Stock bajo (≤5)' },
];

export const COLUMNS_STATIC = ['Producto', 'Categoría'];
export const COLUMNS_END = ['Publicación', 'Páginas', 'Acciones'];

export const fmt = (val) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(val);