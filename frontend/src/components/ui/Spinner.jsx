/**
 * Spinner de carga animado.
 *
 * @param {'sm'|'md'|'lg'} size
 * @param {string} className - Clases adicionales para el wrapper
 */
const Spinner = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  const strokes = { sm: 2.5, md: 2, lg: 2 };

  return (
    <span
      role="status"
      aria-label="Cargando…"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        className={`animate-spin ${dimensions[size]}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pista */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={strokes[size]}
          opacity="0.2"
        />
        {/* Arco activo */}
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth={strokes[size]}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};

export default Spinner;
