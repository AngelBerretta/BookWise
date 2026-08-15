const FilterSearchInput = ({ value, onChange }) => (
  <div className="relative group">
    <span
      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
      style={{ fontSize: '20px', color: 'var(--text-muted)' }}
    >
      search
    </span>
    <input
      type="search"
      placeholder="Buscar en el catálogo…"
      value={value}
      onChange={onChange}
      className="bw-input"
      style={{ paddingLeft: '2.5rem' }}
    />
  </div>
);

export default FilterSearchInput;