import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid from '../../components/product/ProductGrid';
import Pagination from '../../components/ui/Pagination';
import useProductsList from './useProductsList';
import ProductsMobileFilters from './ProductsMobileFilters';
import ProductsToolbar from './ProductsToolbar';

const Products = () => {
  const {
    products, loading, initialLoad, error,
    filters, setFilters, sortBy, setSortBy,
    priceRange, setPriceRange, maxPrice,
    page, setPage, totalPages,
    mobileFiltersOpen, setMobileFiltersOpen, isMobile,
    clearFilters, hasFilters, priceIsFiltered,
    activeFilterCount, categoryLabel, count,
  } = useProductsList();

  const filterProps = {
    filters, setFilters, priceRange, setPriceRange, maxPrice,
    onClear: clearFilters, hasActiveFilters: !!hasFilters,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-12 flex flex-col md:flex-row gap-12">
        <ProductsMobileFilters
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          activeFilterCount={activeFilterCount}
          loading={loading}
          count={count}
          {...filterProps}
        />

        <aside className="hidden md:flex md:flex-col md:w-64 flex-shrink-0 gap-10">
          <ProductFilters {...filterProps} />
        </aside>

        <div className="flex-grow flex flex-col gap-8">
          <ProductsToolbar
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            isMobile={isMobile}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
            priceIsFiltered={priceIsFiltered}
            categoryLabel={categoryLabel}
            count={count}
          />

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