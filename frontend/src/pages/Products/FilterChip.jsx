const FilterChip = ({ label, onRemove }) => (
  <span
    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium"
    style={{
      backgroundColor: 'var(--accent-bg)',
      color: 'var(--accent)',
      border: '1px solid var(--accent-border)',
    }}
  >
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Quitar filtro: ${label}`}
      className="flex items-center justify-center w-4 h-4 rounded-full hover:opacity-70 transition-opacity"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
        <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
      </svg>
    </button>
  </span>
);

export default FilterChip;