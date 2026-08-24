import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import useToast from '../../../hooks/useToast';
import useProductFilters from './useProductFilters';
import useProductCrud from './useProductCrud';
import useProductBulkActions from './useProductBulkActions';

const useAdminProductsPage = () => {
  const { setExtraCrumb } = useOutletContext();
  const { showToast } = useToast();

  const filters = useProductFilters(showToast);
  const crud = useProductCrud(filters.fetchProducts, showToast, setExtraCrumb);
  const bulk = useProductBulkActions(filters.products, filters.fetchProducts, showToast);

  // La selección solo tiene sentido sobre la página/búsqueda actual.
  const [selectionFilters, setSelectionFilters] = useState({
    page: filters.page, search: filters.search, category: filters.category, stock: filters.stock, sort: filters.sort,
  });
  if (
    selectionFilters.page !== filters.page ||
    selectionFilters.search !== filters.search ||
    selectionFilters.category !== filters.category ||
    selectionFilters.stock !== filters.stock ||
    selectionFilters.sort !== filters.sort
  ) {
    setSelectionFilters({
      page: filters.page, search: filters.search, category: filters.category, stock: filters.stock, sort: filters.sort,
    });
    bulk.setSelected(new Set());
  }

  const showSkeleton = filters.loading && filters.products.length === 0;

  return { ...filters, ...crud, ...bulk, showSkeleton };
};

export default useAdminProductsPage;