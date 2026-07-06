/**
 * Paginación numerada con elipsis, estilo BookWise.
 *
 * @param {number}   page         - página actual (1-indexed)
 * @param {number}   totalPages
 * @param {function} onPageChange - (nuevoNumero) => void
 */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handleChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    onPageChange(newPage);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  const getPageList = () => {
    const delta = 1;
    const middle = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      middle.push(i);
    }
    const withEllipsis = [];
    if (middle[0] > 2) withEllipsis.push('…');
    withEllipsis.push(...middle);
    if (middle[middle.length - 1] < totalPages - 1) withEllipsis.push('…');

    return [1, ...withEllipsis, totalPages].filter(
      (v, i, arr) => arr.indexOf(v) === i
    );
  };

  const btnBase =
    'min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center';

  return (
    <nav className="flex items-center justify-center gap-1 pt-10" aria-label="Paginación">
      <button
        onClick={() => handleChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{ color: 'var(--bw-on-surface-variant)' }}
      >
        ‹
      </button>

      {getPageList().map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm" style={{ color: 'var(--bw-outline)' }}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => handleChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={btnBase}
            style={
              p === page
                ? { backgroundColor: 'var(--bw-primary)', color: '#fff' }
                : { color: 'var(--bw-on-surface-variant)' }
            }
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => handleChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{ color: 'var(--bw-on-surface-variant)' }}
      >
        ›
      </button>
    </nav>
  );
};

export default Pagination;