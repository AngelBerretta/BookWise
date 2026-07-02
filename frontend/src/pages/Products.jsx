import useProducts    from '../hooks/useProducts';
import ProductFilters from '../components/product/ProductFilters';
import ProductGrid    from '../components/product/ProductGrid';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest Additions' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title-asc',  label: 'Title: A → Z' },
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

  const count = initialLoad ? '…' : products.length;

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
              {filters.category || filters.search ? 'Resultados' : 'The Catalog'}
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
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none font-body text-sm font-medium
                             pr-6 pl-1 py-1 bg-transparent border-none
                             focus:ring-0 cursor-pointer"
                  style={{ color: 'var(--bw-primary)' }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {/* Chevron */}
                <span
                  className="material-symbols-outlined absolute right-0 top-1/2
                             -translate-y-1/2 pointer-events-none"
                  style={{ fontSize: '16px', color: 'var(--bw-outline)' }}
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

        </div>
      </main>

      <CatalogFooter />
    </div>
  );
};

/* ── Footer ── */
const CatalogFooter = () => (
  <footer
    className="w-full mt-24 py-16 font-body text-sm tracking-wide"
    style={{ backgroundColor: 'var(--bw-primary, #041627)', color: '#fbf9f4' }}
  >
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <span
          className="text-xl font-headline"
          style={{ fontFamily: "'Newsreader', Georgia, serif" }}
        >
          BookWise
        </span>
        <p style={{ color: 'rgba(251,249,244,0.60)' }}>
          © {new Date().getFullYear()} BookWise Curator. All rights reserved.
        </p>
      </div>
      {[
        ['The Manifesto', 'Shipping Policy'],
        ['Affiliate Program', 'Institutional Access'],
        ['Contact'],
      ].map((links, i) => (
        <div key={i} className="flex flex-col gap-3">
          {links.map(label => (
            <a
              key={label}
              href="#"
              className="transition-colors duration-300"
              style={{ color: 'rgba(251,249,244,0.60)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fbf9f4')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(251,249,244,0.60)')}
            >
              {label}
            </a>
          ))}
        </div>
      ))}
    </div>
  </footer>
);

export default Products;