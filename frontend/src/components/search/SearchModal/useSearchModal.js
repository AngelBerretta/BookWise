import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../../services/productService';
import { getPosts } from '../../../services/blogService';

const RESULT_LIMIT = 5;

/**
 * Estado y lógica del buscador global: foco automático, scroll-lock,
 * cierre con Escape y búsqueda debounced de productos + posts en paralelo.
 */
const useSearchModal = (onClose) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Si el query está vacío, no hace falta "resetear" products/posts acá —
  // alcanza con derivarlos vacíos en el render (ver displayedProducts/Posts).
  useEffect(() => {
    const term = query.trim();
    if (!term) return;

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const [productsRes, postsRes] = await Promise.all([
          getProducts({ search: term, limit: RESULT_LIMIT }),
          getPosts({ search: term, limit: 3 }),
        ]);
        setProducts(productsRes.payload ?? []);
        setPosts(postsRes.payload ?? []);
      } catch {
        setProducts([]);
        setPosts([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  const term = query.trim();
  const displayedProducts = term ? products : [];
  const displayedPosts = term ? posts : [];
  const hasResults = displayedProducts.length > 0 || displayedPosts.length > 0;

  const goToAllResults = () => {
    if (!term) return;
    navigate(`/products?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToAllResults();
  };

  return {
    query, setQuery, loading, searched, inputRef,
    term, displayedProducts, displayedPosts, hasResults,
    goToAllResults, handleSubmit,
  };
};

export default useSearchModal;