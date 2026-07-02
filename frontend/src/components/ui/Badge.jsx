import { PRODUCT_CATEGORIES } from '../../utils/constants';

/**
 * Badge de categoría de producto.
 * Los colores se asignan de forma determinista según la categoría.
 *
 * @param {string} category - Valor de la categoría (ej: 'ficcion', 'poesia')
 * @param {string} className - Clases adicionales
 */

/* Paleta de colores: cada categoría tiene su par bg/text */
const CATEGORY_COLORS = {
  'ficcion':             'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'no-ficcion':          'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'ciencia-tecnologia':  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'desarrollo-personal': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'infantil-juvenil':    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'poesia':              'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'ebooks':              'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const DEFAULT_COLOR = 'bg-[var(--accent-bg)] text-[var(--accent)]';

const Badge = ({ category, className = '' }) => {
  /* Busca el label legible en las constantes */
  const found = PRODUCT_CATEGORIES.find((c) => c.value === category);
  const label = found?.label ?? category ?? 'Sin categoría';

  const colorClasses = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5',
        'text-xs font-medium rounded-full',
        'whitespace-nowrap',
        colorClasses,
        className,
      ].join(' ')}
    >
      {label}
    </span>
  );
};

export default Badge;
