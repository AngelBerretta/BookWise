const ClearFiltersButton = ({ onClick }) => (
  <div className="flex justify-end">
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 font-label text-xs font-medium transition-colors"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-h)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
        filter_alt_off
      </span>
      Limpiar filtros
    </button>
  </div>
);

export default ClearFiltersButton;