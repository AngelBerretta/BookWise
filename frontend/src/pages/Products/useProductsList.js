import { useState, useEffect } from 'react';
import useProducts from '../../hooks/useProducts';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

/**
 * Envuelve useProducts con el estado de UI propio de la página:
 * detección de mobile, modal de filtros, chips activos y su conteo.
 */
const useProductsList = () => {
  const products = useProducts();
  const {
    filters, setFilters, sortBy, setSortBy,
    priceRange, setPriceRange, maxPrice,
    loading, initialLoad, totalDocs,
  } = products;

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

  const priceIsFiltered = priceRange[0] > 0 || (maxPrice > 0 && priceRange[1] < maxPrice);

  const hasFilters =
    filters.search || filters.category || sortBy !== 'newest' || priceIsFiltered;

  // Solo cuenta los filtros "de chip" (no el sort) — para el badge del botón mobile
  const activeFilterCount =
    (filters.search ? 1 : 0) + (filters.category ? 1 : 0) + (priceIsFiltered ? 1 : 0);

  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.label ?? filters.category;

  const count = initialLoad ? '…' : totalDocs;

  return {
    ...products,
    mobileFiltersOpen, setMobileFiltersOpen,
    isMobile, clearFilters, hasFilters, priceIsFiltered,
    activeFilterCount, categoryLabel, count,
  };
};

export default useProductsList;