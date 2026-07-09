import { PRODUCT_CATEGORIES } from '../../utils/constants';

const ProductFilters = ({
  filters,
  setFilters,
  priceRange,
  setPriceRange,
  maxPrice,
  onClear,
  hasActiveFilters,
}) => {

  const handleSearchChange   = (e) => setFilters({ search: e.target.value });
  const handleCategoryChange = (category) =>
    setFilters({ category: filters.category === category ? '' : category });

  // Formatea precio en ARS
  const fmt = (n) =>
    new Intl.NumberFormat('es-AR', {
      style:               'currency',
      currency:            'ARS',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <>
      {/* ── Búsqueda ── */}
      <div className="relative group">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2
                     -translate-y-1/2 pointer-events-none transition-colors"
          style={{ fontSize: '20px', color: 'var(--text-muted)' }}
        >
          search
        </span>
        <input
          type="search"
          placeholder="Buscar en el catálogo…"
          value={filters.search}
          onChange={handleSearchChange}
          className="bw-input"
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* ── Categorías ── */}
      <div className="flex flex-col gap-4">
        <h3
          className="font-headline text-lg italic tracking-tight"
          style={{
            color:      'var(--text-h)',
            fontFamily: "'Newsreader', Georgia, serif",
          }}
        >
          Colecciones curadas
        </h3>

        <div className="flex flex-col gap-2">
          <CategoryItem
            label="Todas las colecciones"
            active={!filters.category}
            onClick={() => setFilters({ category: '' })}
          />
          {PRODUCT_CATEGORIES.map(({ value, label }) => (
            <CategoryItem
              key={value}
              label={label}
              active={filters.category === value}
              onClick={() => handleCategoryChange(value)}
            />
          ))}
        </div>
      </div>

      {/* ── Rango de precio ── */}
      {maxPrice > 0 && (
        <div className="flex flex-col gap-4">
          <h3
            className="font-headline text-lg italic tracking-tight"
            style={{
              color:      'var(--text-h)',
              fontFamily: "'Newsreader', Georgia, serif",
            }}
          >
            Rango de precio
          </h3>

          {/* Slider doble con dos inputs range superpuestos */}
          <div className="flex flex-col gap-3">
            <DualRangeSlider
              min={0}
              max={maxPrice}
              value={priceRange}
              onChange={setPriceRange}
            />

            {/* Etiquetas */}
            <div className="flex justify-between">
              <span
                className="font-body text-xs"
                style={{ color: 'var(--text)' }}
              >
                {fmt(priceRange[0])}
              </span>
              <span
                className="font-body text-xs"
                style={{ color: 'var(--text)' }}
              >
                {fmt(priceRange[1])}
              </span>
            </div>

            {/* Reset precio */}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <button
                onClick={() => setPriceRange([0, maxPrice])}
                className="font-label text-xs w-fit transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-h)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Restablecer precio
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Limpiar todos los filtros ── */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 font-label text-sm
                     transition-colors w-fit"
          style={{ color: 'var(--text)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-h)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            filter_alt_off
          </span>
          Limpiar filtros
        </button>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────
   Slider doble (min / max)
───────────────────────────────────────────── */
const DualRangeSlider = ({ min, max, value, onChange }) => {
  const [lo, hi] = value;

  const handleLo = (e) => {
    const v = Number(e.target.value);
    if (v <= hi) onChange([v, hi]);
  };

  const handleHi = (e) => {
    const v = Number(e.target.value);
    if (v >= lo) onChange([lo, v]);
  };

  // Porcentajes para la barra coloreada
  const pctLo = ((lo - min) / (max - min)) * 100;
  const pctHi = ((hi - min) / (max - min)) * 100;

  return (
    <div className="relative h-5 flex items-center">
      {/* Track de fondo */}
      <div
        className="absolute w-full h-1 rounded-full"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* Track activo (coloreado entre los dos thumbs) */}
      <div
        className="absolute h-1 rounded-full"
        style={{
          left:            `${pctLo}%`,
          width:           `${pctHi - pctLo}%`,
          backgroundColor: 'var(--accent)',
        }}
      />

      {/* Input MIN */}
      <input
        type="range"
        min={min}
        max={max}
        value={lo}
        onChange={handleLo}
        className="dual-range-input"
      />

      {/* Input MAX */}
      <input
        type="range"
        min={min}
        max={max}
        value={hi}
        onChange={handleHi}
        className="dual-range-input"
      />
    </div>
  );
};

/* ── Item de categoría ── */
const CategoryItem = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 text-left w-full transition-colors"
  >
    <span
      className="w-1 h-4 rounded-full flex-shrink-0 transition-all duration-200"
      style={{
        backgroundColor: active ? 'var(--accent)' : 'transparent',
        border:          active ? 'none' : '1px solid var(--border)',
      }}
    />
    <span
      className="font-body text-sm transition-colors"
      style={{
        color:      active ? 'var(--accent)' : 'var(--text)',
        fontWeight: active ? 500 : 400,
      }}
    >
      {label}
    </span>
  </button>
);

export default ProductFilters;