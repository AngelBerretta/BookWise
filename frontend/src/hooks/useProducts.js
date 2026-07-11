import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as productService from '../services/productService';

const PAGE_SIZE = 12;

/**
 * Paginación, filtros, orden y rango de precio son 100% server-side.
 * El hook nunca vuelve a filtrar/ordenar en el cliente: lo que llega
 * en `products` es exactamente lo que hay que pintar.
 *
 * La categoría vive también en el query param `?category=`, así los
 * links del footer / navbar pueden llegar con un filtro aplicado y
 * el catálogo filtrado es compartible/bookmarkeable.
 */
const useProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const [filters, setFiltersRaw] = useState({
    category: searchParams.get('category') ?? '',
    search: '',
  });
  const [sortBy, setSortBy]      = useState('newest');

  const [priceRange, setPriceRangeRaw] = useState([0, 0]);
  const [maxPrice, setMaxPrice]        = useState(0);
  const [priceReady, setPriceReady]    = useState(false);

  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs]   = useState(0);

  const debounceRef = useRef(null);
  const didMountRef = useRef(false);
  const requestIdRef = useRef(0);

  /* ── Precio máximo global del catálogo — se obtiene UNA sola vez ── */
  useEffect(() => {
    productService.getMaxPrice()
      .then((data) => {
        const max = data?.maxPrice ?? 0;
        setMaxPrice(max);
        setPriceRangeRaw([0, max]);
      })
      .catch(() => setMaxPrice(0)) // maxPrice se queda en 0 → filtro de precio deshabilitado, no "rango 0-0"
      .finally(() => setPriceReady(true));
  }, []);

  /* ── Fetch ── */
  const fetchProducts = useCallback(async (params) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(params);
      if (requestId !== requestIdRef.current) return; // llegó una respuesta vieja, se descarta
      setProducts(data.payload ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotalDocs(data.totalDocs ?? 0);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(
        err?.message ||
        err?.response?.data?.message ||
        'No se pudieron cargar los productos.'
      );
      setProducts([]);
      setTotalPages(1);
      setTotalDocs(0);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  }, []);

  /* Cualquier cambio de filtro/orden/precio vuelve a la página 1 */
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    setPage(1);
  }, [filters.category, filters.search, sortBy, priceRange[0], priceRange[1]]);

  /* Mantiene ?category= en la URL en sync con el filtro activo
     (replace, no push: no queremos ensuciar el historial en cada click) */
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (filters.category) next.set('category', filters.category);
      else next.delete('category');
      return next;
    }, { replace: true });
  }, [filters.category, setSearchParams]);

  /* Fetch real — debounced. Depende también de `page` para paginar. */
  useEffect(() => {
    if (!priceReady) return; // espera el rango inicial de precio

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts({
        category: filters.category,
        search:   filters.search,
        sort:     sortBy,
        ...(maxPrice > 0 ? { minPrice: priceRange[0], maxPrice: priceRange[1] } : {}),
        limit:    PAGE_SIZE,
        page,
      });
    }, filters.search ? 400 : 150);

    return () => clearTimeout(debounceRef.current);
  }, [
    filters.category, filters.search, sortBy,
    priceRange[0], priceRange[1], page,
    priceReady, maxPrice, fetchProducts,
  ]);

  const setFilters = useCallback((partial) => {
    setFiltersRaw((prev) => ({ ...prev, ...partial }));
  }, []);

  const setPriceRange = useCallback((range) => setPriceRangeRaw(range), []);

  const refetch = useCallback(() => {
    fetchProducts({
      category: filters.category,
      search:   filters.search,
      sort:     sortBy,
      ...(maxPrice > 0 ? { minPrice: priceRange[0], maxPrice: priceRange[1] } : {}),
      limit:    PAGE_SIZE,
      page,
    });
  }, [fetchProducts, filters, sortBy, priceRange, maxPrice, page]);

  return {
    products,
    loading,
    initialLoad,
    error,
    filters,
    setFilters,
    refetch,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    maxPrice,
    // 🆕 paginación
    page,
    setPage,
    totalPages,
    totalDocs,
  };
};

export default useProducts;