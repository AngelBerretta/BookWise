import { useState, useCallback, useRef } from 'react';
import * as blogService from '../services/blogService';

const useBlog = () => {
  const [posts, setPosts]     = useState([]);
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [search, setSearchRaw] = useState('');
  const debounceRef           = useRef(null);

  const normalizeError = (err) =>
    err?.response?.data?.message ||
    err?.message ||
    'Ocurrió un error inesperado.';

  /* ── GET todos ── */
  const fetchPosts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getPosts(filters);
      setPosts(Array.isArray(data) ? data : (data.posts ?? []));
    } catch (err) {
      setError(normalizeError(err));
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  /* ── Search con debounce ── */
  const setSearch = useCallback((value) => {
    setSearchRaw(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchPosts(value.trim() ? { search: value.trim() } : {});
    }, 400);
  }, [fetchPosts]);

  /* ── CREATE ── */
  const createPost = useCallback(async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const created = await blogService.createPost(postData);
      setPosts((prev) => [created, ...prev]);
      return created;
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
      const updated = await blogService.updatePost(id, postData);
      setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
      return updated;
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
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      const msg = normalizeError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    post,
    loading,
    error,
    search,
    setSearch,
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost,
  };
};

export default useBlog;