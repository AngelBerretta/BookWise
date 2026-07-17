import { useState, useEffect, useCallback, useRef } from 'react';
import * as blogService from '../services/blogService';

const PAGE_SIZE = 10;

const useBlog = () => {
  const [posts, setPosts]     = useState([]);
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const [search, setSearchRaw]      = useState('');
  const [published, setPublished]   = useState(undefined); // undefined = todos, true/false = filtro
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs]   = useState(0);

  const debounceRef = useRef(null);
  const didMountRef = useRef(false);

  const normalizeError = (err) =>
    err?.response?.data?.message ||
    err?.message ||
    'Ocurrió un error inesperado.';

  /* ── GET todos — bajo nivel, admite overrides puntuales ── */
  const fetchPosts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getPosts(filters);
      const list = Array.isArray(data) ? data : (data.payload ?? []);
      setPosts(list);
      setTotalPages(data.totalPages ?? 1);
      setTotalDocs(data.totalDocs ?? list.length);
    } catch (err) {
      setError(normalizeError(err));
      setPosts([]);
      setTotalPages(1);
      setTotalDocs(0);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Cambiar la búsqueda o el filtro de publicado vuelve a página 1 */
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    setPage(1);
  }, [search, published]);

  /* Fetch automático — mount, cambio de página, búsqueda o filtro (con debounce) */
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchPosts({
        search: search.trim() || undefined,
        published,
        page,
        limit: PAGE_SIZE,
      });
    }, search ? 400 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [search, published, page, fetchPosts]);

  const setSearch = useCallback((value) => setSearchRaw(value), []);

  /* Vuelve a pedir la página actual — usar tras crear/editar/eliminar */
  const refetch = useCallback(() => {
    fetchPosts({ search: search.trim() || undefined, published, page, limit: PAGE_SIZE });
  }, [fetchPosts, search, published, page]);

  /* ── GET por slug ── */
  const fetchPostBySlug = useCallback(async (slug) => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setPost(null);
    try {
      const data = await blogService.getPostBySlug(slug, controller.signal);
      setPost(data.post ?? data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, []);

  /* ── CREATE ── */
  const createPost = useCallback(async (postData) => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.createPost(postData);
    } catch (err) {
      const msg = normalizeError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── UPDATE ── */
  const updatePost = useCallback(async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.updatePost(id, postData);
    } catch (err) {
      const msg = normalizeError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── DELETE ── */
  const deletePost = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await blogService.deletePost(id);
    } catch (err) {
      const msg = normalizeError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts, post, loading, error,
    search, setSearch,
    published, setPublished,
    page, setPage, totalPages, totalDocs,
    fetchPosts, refetch, fetchPostBySlug,
    createPost, updatePost, deletePost,
  };
};

export default useBlog;