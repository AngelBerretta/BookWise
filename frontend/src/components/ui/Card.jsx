/**
 * Contenedor Card reutilizable.
 *
 * @param {string}          className   - Clases adicionales para extender estilos
 * @param {boolean}         hoverable   - Agrega efecto hover sutil
 * @param {boolean}         noPadding   - Quita el padding por defecto
 * @param {React.ReactNode} children
 */
const Card = ({
  className  = '',
  hoverable  = false,
  noPadding  = false,
  children,
}) => {
  const base = [
    'bg-[var(--bg)] border border-[var(--border)]',
    'rounded-2xl',
    'shadow-[var(--shadow)]',
    noPadding ? '' : 'p-5',
    hoverable
      ? 'transition-all duration-200 hover:border-[var(--accent-border)] hover:shadow-lg cursor-pointer'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={base}>{children}</div>;
};

export default Card;
