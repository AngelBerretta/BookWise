import { PRODUCT_CATEGORIES } from '../../../utils/constants';
import DualRangeSlider from './DualRangeSlider';
import PriceNumberInputs from './PriceNumberInputs';
import CategoryItem from './CategoryItem';

const ProductFilters = ({
  filters, setFilters, priceRange, setPriceRange, maxPrice, onClear, hasActiveFilters,
}) => {
  const handleSearchChange = (e) => setFilters({ search: e.target.value });
  const handleCategoryChange = (category) =>
    setFilters({ category: filters.category === category ? '' : category });

  return (
    <>
      <div className="flex flex-col gap-3">
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={onClear}
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
        )}

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
            value={filters.search}
            onChange={handleSearchChange}
            className="bw-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3
          className="font-headline text-lg italic tracking-tight"
          style={{ color: 'var(--text-h)', fontFamily: "'Newsreader', Georgia, serif" }}
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

      {maxPrice > 0 && (
        <div className="flex flex-col gap-4">
          <h3
            className="font-headline text-lg italic tracking-tight"
            style={{ color: 'var(--text-h)', fontFamily: "'Newsreader', Georgia, serif" }}
          >
            Rango de precio
          </h3>
          <div className="flex flex-col gap-3">
            <DualRangeSlider min={0} max={maxPrice} value={priceRange} onChange={setPriceRange} />
            <PriceNumberInputs min={0} max={maxPrice} value={priceRange} onChange={setPriceRange} />

            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <button
                onClick={() => setPriceRange([0, maxPrice])}
                className="font-label text-xs w-fit transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-h)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                Restablecer precio
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;