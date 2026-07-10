import { useState, useEffect } from 'react';
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

            {/* Inputs editables — permiten tipear un valor exacto */}
            <PriceNumberInputs
              min={0}
              max={maxPrice}
              value={priceRange}
              onChange={setPriceRange}
            />

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

/* ─────────────────────────────────────────────
   Inputs numéricos de precio — con buffer local
   para no pelear con el clamp mientras se tipea.
───────────────────────────────────────────── */
const PriceNumberInputs = ({ min, max, value, onChange }) => {
  const [lo, hi] = value;
  const [draftLo, setDraftLo] = useState(String(lo));
  const [draftHi, setDraftHi] = useState(String(hi));
  const [editingLo, setEditingLo] = useState(false);
  const [editingHi, setEditingHi] = useState(false);

  // Sincroniza el buffer con el valor real SOLO si el usuario no está
  // tipeando ahí en ese momento (evita pisar lo que está escribiendo).
  useEffect(() => { if (!editingLo) setDraftLo(String(lo)); }, [lo, editingLo]);
  useEffect(() => { if (!editingHi) setDraftHi(String(hi)); }, [hi, editingHi]);

  const commitLo = () => {
    setEditingLo(false);
    const parsed  = Number(draftLo);
    const clamped = Number.isNaN(parsed) ? lo : Math.min(Math.max(parsed, min), hi);
    onChange([clamped, hi]);
    setDraftLo(String(clamped));
  };

  const commitHi = () => {
    setEditingHi(false);
    const parsed  = Number(draftHi);
    const clamped = Number.isNaN(parsed) ? hi : Math.max(Math.min(parsed, max), lo);
    onChange([lo, clamped]);
    setDraftHi(String(clamped));
  };

  const inputCls = "bw-input text-xs";
  const labelCls = "text-[10px] uppercase tracking-wide";

  return (
    <div className="flex items-center gap-3">
      <label className="flex flex-col gap-1 flex-1">
        <span className={labelCls} style={{ color: 'var(--text-muted)' }}>Mín.</span>
        <input
          type="number"
          inputMode="numeric"
          value={draftLo}
          onFocus={() => setEditingLo(true)}
          onChange={(e) => setDraftLo(e.target.value)}
          onBlur={commitLo}
          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
          aria-label="Precio mínimo exacto"
          className={inputCls}
          style={{ padding: '0.4rem 0.6rem' }}
        />
      </label>
      <span className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>–</span>
      <label className="flex flex-col gap-1 flex-1">
        <span className={labelCls} style={{ color: 'var(--text-muted)' }}>Máx.</span>
        <input
          type="number"
          inputMode="numeric"
          value={draftHi}
          onFocus={() => setEditingHi(true)}
          onChange={(e) => setDraftHi(e.target.value)}
          onBlur={commitHi}
          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
          aria-label="Precio máximo exacto"
          className={inputCls}
          style={{ padding: '0.4rem 0.6rem' }}
        />
      </label>
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