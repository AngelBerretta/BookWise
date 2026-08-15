import ClearFiltersButton from './ClearFiltersButton';
import FilterSearchInput from './FilterSearchInput';
import FilterCategoryList from './FilterCategoryList';
import FilterPriceRange from './FilterPriceRange';

const ProductFilters = ({
  filters, setFilters, priceRange, setPriceRange, maxPrice, onClear, hasActiveFilters,
}) => {
  const handleSearchChange = (e) => setFilters({ search: e.target.value });
  const handleCategorySelect = (category) => setFilters({ category });

  return (
    <>
      <div className="flex flex-col gap-3">
        {hasActiveFilters && <ClearFiltersButton onClick={onClear} />}
        <FilterSearchInput value={filters.search} onChange={handleSearchChange} />
      </div>

      <FilterCategoryList activeCategory={filters.category} onSelect={handleCategorySelect} />

      {maxPrice > 0 && (
        <FilterPriceRange maxPrice={maxPrice} priceRange={priceRange} setPriceRange={setPriceRange} />
      )}
    </>
  );
};

export default ProductFilters;