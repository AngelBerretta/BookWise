import { useState, useEffect } from 'react';
import useProducts    from '../hooks/useProducts';
import ProductFilters from '../components/product/ProductFilters';
import ProductGrid    from '../components/product/ProductGrid';
import Pagination     from '../components/ui/Pagination';
import Modal           from '../components/ui/Modal';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import { formatPrice }        from '../utils/formatPrice';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Más recientes',          shortLabel: 'Recientes' },
  { value: 'price-asc',  label: 'Precio: menor a mayor',  shortLabel: 'Precio ↑' },
  { value: 'price-desc', label: 'Precio: mayor a menor',  shortLabel: 'Precio ↓' },
  { value: 'title-asc',  label: 'Título: A → Z',          shortLabel: 'Título A-Z' },
];

const Products = () => {
  const {
    products,
    loading,
    initialLoad,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    maxPrice,
    page,
    setPage,
    totalPages,
    totalDocs,
  } = useProducts();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const clearFilters = () => {
    setFilters({ search: '', category: '' });
    setPriceRange([0, maxPrice]);
    setSortBy('newest');
  };

  const hasFilters =
    filters.search ||
    filters.category ||
    sortBy !== 'newest' ||
    priceRange[0] > 0 ||
    (maxPrice > 0 && priceRange[1] < maxPrice);

  // Solo cuenta los filtros "de chip" (no el sort) — para el badge del botón mobile
  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    ((priceRange[0] > 0 || (maxPrice > 0 && priceRange[1] < maxPrice)) ? 1 : 0);

  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.label ?? filters.category;

  const count = initialLoad ? '…' : totalDocs;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <main
        className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-12
                   flex flex-col md:flex-row gap-12"
      >
        {/* ── Barra de filtros — solo mobile ── */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--text-h)' }}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filtros
            {activeFilterCount > 0 && (
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {mobileFiltersOpen && (
          <Modal
            title="Filtros"
            size="md"
            onClose={() => setMobileFiltersOpen(false)}
            footer={
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
                style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
              >
                {loading ? 'Buscando…' : `Ver ${count} ${count === 1 ? 'resultado' : 'resultados'}`}
              </button>
            }
          >
            <div className="flex flex-col gap-10">
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
                onClear={clearFilters}
                hasActiveFilters={!!hasFilters}
              />
            </div>
          </Modal>
        )}       

        {/* ── Sidebar ── */}
        <aside className="hidden md:flex md:flex-col md:w-64 flex-shrink-0 gap-10">
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
            onClear={clearFilters}
            hasActiveFilters={!!hasFilters}
          />
        </aside>

        {/* ── Contenido ── */}
        <div className="flex-grow flex flex-col gap-8">

          {/* Encabezado + sort */}
          <div
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <h2
              className="font-headline tracking-tight"
              style={{
                fontSize:   'clamp(1.6rem, 3vw, 2rem)',
                color:      'var(--text-h)',
                fontFamily: "'Newsreader', Georgia, serif",
                fontWeight: 500,
              }}
            >
              {filters.category || filters.search ? 'Resultados' : 'El catálogo'}
              <span
                className="font-body font-normal ml-3"
                style={{ fontSize: '1rem', color: 'var(--text)' }}
              >
                ({count} {count === 1 ? 'título' : 'títulos'})
              </span>
            </h2>

            {/* Sort selector */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
              <span
                className="font-body text-sm whitespace-nowrap hidden sm:inline"
                style={{ color: 'var(--text)' }}
              >
                Ordenar por:
              </span>
              <div className="relative min-w-0 flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bw-select w-full sm:w-auto pr-6"
                  aria-label="Ordenar productos por"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>
                      {isMobile ? o.shortLabel : o.label}
                    </option>
                  ))}
                </select>
                <span
                  className="material-symbols-outlined absolute right-0 top-1/2
                            -translate-y-1/2 pointer-events-none text-[16px]
                            text-[var(--bw-outline)]"
                >
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* ── Chips de filtros activos ── */}
          {(filters.search || filters.category ||
            priceRange[0] > 0 || (maxPrice > 0 && priceRange[1] < maxPrice)) && (
            <div className="flex flex-wrap items-center gap-2 -mt-2">
              {filters.search && (
                <FilterChip
                  label={`Búsqueda: "${filters.search}"`}
                  onRemove={() => setFilters({ search: '' })}
                />
              )}
              {filters.category && (
                <FilterChip
                  label={categoryLabel}
                  onRemove={() => setFilters({ category: '' })}
                />
              )}
              {(priceRange[0] > 0 || (maxPrice > 0 && priceRange[1] < maxPrice)) && (
                <FilterChip
                  label={`${formatPrice(priceRange[0], false)} – ${formatPrice(priceRange[1], false)}`}
                  onRemove={() => setPriceRange([0, maxPrice])}
                />
              )}
            </div>
          )}

          {/* Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            initialLoad={initialLoad}
            error={error}
            onClearFilters={hasFilters ? clearFilters : undefined}
          />

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        </div>
      </main>
    </div>
  );
};

const FilterChip = ({ label, onRemove }) => (
  <span
    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium"
    style={{
      backgroundColor: 'var(--accent-bg)',
      color:           'var(--accent)',
      border:          '1px solid var(--accent-border)',
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

export default Products;
