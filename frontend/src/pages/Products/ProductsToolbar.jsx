import { formatPrice } from '../../utils/formatPrice';
import FilterChip from './FilterChip';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes', shortLabel: 'Recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor', shortLabel: 'Precio ↑' },
  { value: 'price-desc', label: 'Precio: mayor a menor', shortLabel: 'Precio ↓' },
  { value: 'title-asc', label: 'Título: A → Z', shortLabel: 'Título A-Z' },
];

/** Encabezado con conteo + selector de orden, y chips de filtros activos. */
const ProductsToolbar = ({
  filters, setFilters, sortBy, setSortBy, isMobile,
  priceRange, setPriceRange, maxPrice, priceIsFiltered, categoryLabel, count,
}) => (
  <>
    <div
      className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <h2
        className="font-headline tracking-tight"
        style={{
          fontSize: 'clamp(1.6rem, 3vw, 2rem)',
          color: 'var(--text-h)',
          fontFamily: "'Newsreader', Georgia, serif",
          fontWeight: 500,
        }}
      >
        {filters.category || filters.search ? 'Resultados' : 'El catálogo'}
        <span className="font-body font-normal ml-3" style={{ fontSize: '1rem', color: 'var(--text)' }}>
          ({count} {count === 1 ? 'título' : 'títulos'})
        </span>
      </h2>

      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
        <span className="font-body text-sm whitespace-nowrap hidden sm:inline" style={{ color: 'var(--text)' }}>
          Ordenar por:
        </span>
        <div className="relative min-w-0 flex-1 sm:flex-none">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bw-select w-full sm:w-auto pr-6"
            aria-label="Ordenar productos por"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {isMobile ? o.shortLabel : o.label}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-[var(--bw-outline)]">
            expand_more
          </span>
        </div>
      </div>
    </div>

    {(filters.search || filters.category || priceIsFiltered) && (
      <div className="flex flex-wrap items-center gap-2 -mt-2">
        {filters.search && (
          <FilterChip label={`Búsqueda: "${filters.search}"`} onRemove={() => setFilters({ search: '' })} />
        )}
        {filters.category && (
          <FilterChip label={categoryLabel} onRemove={() => setFilters({ category: '' })} />
        )}
        {priceIsFiltered && (
          <FilterChip
            label={`${formatPrice(priceRange[0], false)} – ${formatPrice(priceRange[1], false)}`}
            onRemove={() => setPriceRange([0, maxPrice])}
          />
        )}
      </div>
    )}
  </>
);

export default ProductsToolbar;