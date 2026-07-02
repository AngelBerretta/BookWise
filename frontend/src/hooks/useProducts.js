import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as productService from '../services/productService';

const useProducts = () => {
  const [allProducts, setAllProducts] = useState([]); // datos crudos del backend
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const [filters, setFiltersRaw] = useState({
    category: '',
    search:   '',
  });

  // Controles client-side
  const [sortBy, setSortBy]         = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 0]); // [min, max] — 0,0 = sin límite
  const [maxPrice, setMaxPrice]     = useState(0);       // precio máximo real del catálogo

  const debounceRef = useRef(null);

  /* ── Fetch ── */
  const fetchProducts = useCallback(async (activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(activeFilters);
      const list = Array.isArray(data) ? data : (data.payload ?? []);
      setAllProducts(list);

      if (list.length) {
        const max = Math.ceil(Math.max(...list.map(p => p.price ?? 0)));
        setMaxPrice(max);

        // ✅ Siempre resetea al nuevo rango cuando cambia el catálogo
        setPriceRange([0, max]);
      } else {
        setMaxPrice(0);
        setPriceRange([0, 0]);
      }
    } catch (err) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        'No se pudieron cargar los productos.';
      setError(message);
      setAllProducts([]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  // Re-fetch cuando cambian los filtros de backend (search/category)
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(filters);
    }, filters.search ? 400 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchProducts]);

  /* ── Filtrado y ordenamiento client-side ── */
  const products = useMemo(() => {
    let list = [...allProducts];

    // Filtro de precio
    if (priceRange[1] > 0) {
      list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }

    // Ordenamiento
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'title-asc':
        list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
        break;
      case 'newest':
      default:
        // Mantiene el orden del backend (más reciente primero)
        break;
    }

    return list;
  }, [allProducts, priceRange, sortBy]);

  const setFilters = useCallback((partial) => {
    setFiltersRaw(prev => ({ ...prev, ...partial }));
  }, []);

  const refetch = useCallback(() => fetchProducts(filters), [fetchProducts, filters]);

  return {
    products,
    loading,
    initialLoad,
    error,
    filters,
    setFilters,
    refetch,
    // nuevos
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    maxPrice,
  };
};

export default useProducts;