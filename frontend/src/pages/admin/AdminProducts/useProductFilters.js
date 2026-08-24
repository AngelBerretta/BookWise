import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as productService from '../../../services/productService';
import useSlashFocus from '../../../hooks/useSlashFocus';
import { PAGE_SIZE } from './adminProductsConfig';

const useProductFilters = (showToast) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [stock, setStock] = useState(searchParams.get('stock') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const searchInputRef = useRef(null);
  useSlashFocus(searchInputRef);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        search: search.trim() || undefined,
        category: category || undefined,
        stock: stock || undefined,
        page,
        limit: PAGE_SIZE,
        sort,
      });
      setProducts(Array.isArray(data) ? data : (data?.payload ?? []));
      setTotalPages(data?.totalPages ?? 1);
      setTotalDocs(data?.totalDocs ?? 0);
    } catch {
      showToast({ type: 'error', message: 'No se pudieron cargar los productos.' });
    } finally {
      setLoading(false);
    }
  }, [search, category, stock, page, sort, showToast]);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) setPage(1);
    else didMountRef.current = true;
  }, [search, category, stock, sort]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchProducts, search]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (category) next.set('category', category);
    if (stock) next.set('stock', stock);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, stock]);

  const handleSort = (field) => {
    setSort((prev) => {
      if (prev === `${field}-asc`) return `${field}-desc`;
      if (prev === `${field}-desc`) return 'newest';
      return `${field}-asc`;
    });
  };

  const clearFilters = () => { setCategory(''); setStock(''); setSearch(''); };
  const hasActiveFilters = Boolean(category || stock || search);

  return {
    products, loading, fetchProducts,
    search, setSearch, category, setCategory, stock, setStock, sort,
    page, setPage, totalPages, totalDocs,
    searchInputRef, handleSort, clearFilters, hasActiveFilters,
  };
};

export default useProductFilters;