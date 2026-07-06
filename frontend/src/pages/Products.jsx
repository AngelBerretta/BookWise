import useProducts    from '../hooks/useProducts';
import ProductFilters from '../components/product/ProductFilters';
import ProductGrid    from '../components/product/ProductGrid';
import Pagination     from '../components/ui/Pagination';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Más recientes' },
  { value: 'price-asc',  label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'title-asc',  label: 'Título: A → Z' },
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

  const count = initialLoad ? '…' : totalDocs;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bw-surface-container-lowest, #fbf9f4)' }}
    >
      <main
        className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-12
                   flex flex-col md:flex-row gap-12"
      >

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-10">
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
            className="flex flex-col sm:flex-row justify-between items-start
                       sm:items-center gap-4 pb-4"
            style={{
              borderBottom: '1px solid var(--bw-surface-container-highest, #e4e2dd)',
            }}
          >
            <h2
              className="font-headline tracking-tight"
              style={{
                fontSize:   'clamp(1.6rem, 3vw, 2rem)',
                color:      'var(--bw-primary, #041627)',
                fontFamily: "'Newsreader', Georgia, serif",
                fontWeight: 500,
              }}
            >
              {filters.category || filters.search ? 'Resultados' : 'El catálogo'}
              <span
                className="font-body font-normal ml-3"
                style={{
                  fontSize: '1rem',
                  color:    'var(--bw-on-surface-variant, #44474c)',
                }}
              >
                ({count} {count === 1 ? 'título' : 'títulos'})
              </span>
            </h2>

            {/* Sort selector */}
            <div className="flex items-center gap-3">
              <span
                className="font-body text-sm whitespace-nowrap"
                style={{ color: 'var(--bw-on-surface-variant)' }}
              >
                Ordenar por:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bw-select"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {/* Chevron */}
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

export default Products;
