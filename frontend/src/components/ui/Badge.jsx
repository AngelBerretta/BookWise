import { PRODUCT_CATEGORIES, CATEGORY_COLORS } from '../../utils/constants';

/**
 * Badge de categoría de producto.
 * Los colores se asignan de forma determinista según la categoría.
 *
 * @param {string} category - Valor de la categoría (ej: 'ficcion', 'poesia')
 * @param {string} className - Clases adicionales
 */

const DEFAULT_COLOR = 'bg-[var(--accent-bg)] text-[var(--accent)]';

const Badge = ({ category, short = false, className = '' }) => {
  const found = PRODUCT_CATEGORIES.find((c) => c.value === category);
  const fullLabel  = found?.label ?? category ?? 'Sin categoría';
  const shownLabel = short ? (found?.shortLabel ?? fullLabel) : fullLabel;

  const colorClasses = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

  return (
    <span
      className={[
        'inline-flex self-start items-center max-w-full px-2.5 py-0.5',
        'text-xs font-medium rounded-full',
        'truncate',
        colorClasses,
        className,
      ].join(' ')}
      title={fullLabel}
    >
      {shownLabel}
    </span>
  );
};

export default Badge;
