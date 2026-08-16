const SearchModalFooter = ({ term, onClick }) => (
  <button
    onClick={onClick}
    className="shrink-0 px-5 py-3 border-t border-[var(--border)] text-sm font-medium text-[var(--accent)] hover:bg-[var(--bg-subtle)] transition-colors text-left"
  >
    Ver todos los resultados de "{term}" →
  </button>
);

export default SearchModalFooter;