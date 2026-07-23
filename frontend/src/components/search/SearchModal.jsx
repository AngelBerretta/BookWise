import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { getPosts } from '../../services/blogService';
import { formatPrice } from '../../utils/formatPrice';
import { SearchIcon } from '../ui/icons/NavIcons';
import Spinner from '../ui/Spinner';

const RESULT_LIMIT = 5;

/**
 * Buscador global — se abre con el ícono de lupa del navbar o Cmd+K / Ctrl+K.
 * Busca productos y posts del blog en paralelo (debounced) y linkea directo
 * a cada resultado, o a "ver todos los resultados" en /products.
 */
const SearchModal = ({ onClose }) => {
  const [query, setQuery]       = useState('');
  const [products, setProducts] = useState([]);
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Foco automático al abrir
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Búsqueda debounced. Si el query está vacío, no hace falta "resetear"
  // products/posts acá — alcanza con derivarlos vacíos en el render
  // (ver displayedProducts/displayedPosts), así el efecto no necesita
  // un setState síncrono para el caso "sin término".
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

  const goToAllResults = () => {
    const term = query.trim();
    if (!term) return;
    navigate(`/products?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToAllResults();
  };

  const hasResults = displayedProducts.length > 0 || displayedPosts.length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[9500] flex items-start justify-center px-4 pt-20 sm:pt-28"
      role="dialog"
      aria-modal="true"
      aria-label="Buscador"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-[var(--shadow-lg)] flex flex-col max-h-[70vh] overflow-hidden">

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] shrink-0">
          <span className="text-[var(--text)] shrink-0">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar libros, autores, artículos del blog…"
            className="flex-1 min-w-0 bg-transparent outline-none text-base text-[var(--text-h)] placeholder:text-[var(--text)] placeholder:opacity-50"
          />
          {loading && <Spinner size="sm" className="text-[var(--text)] shrink-0" />}
          <kbd className="hidden sm:flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-[var(--text)] border border-[var(--border)] bg-[var(--bg-subtle)] shrink-0">
            ESC
          </kbd>
        </form>

        {/* Resultados */}
        <div className="overflow-y-auto flex-1">
          {!term && (
            <p className="px-5 py-10 text-center text-sm text-[var(--text)] opacity-60">
              Empezá a escribir para buscar en todo BookWise.
            </p>
          )}

          {term && !loading && searched && !hasResults && (
            <p className="px-5 py-10 text-center text-sm text-[var(--text)]">
              No encontramos nada para <span className="font-medium text-[var(--text-h)]">"{term}"</span>.
            </p>
          )}

          {displayedProducts.length > 0 && (
            <div className="py-2">
              <p className="px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text)] opacity-60">
                Libros
              </p>
              {displayedProducts.map((product) => {
                const thumbnail = product?.thumbnails?.[0] || product?.url;
                return (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <span className="shrink-0 w-9 h-12 rounded-md overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center">
                      {thumbnail ? (
                        <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-sm" style={{ color: 'var(--border)' }}>
                          menu_book
                        </span>
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-[var(--text-h)] line-clamp-1">
                        {product.title}
                      </span>
                      <span className="block text-xs text-[var(--text)] opacity-70">
                        {formatPrice(product.price, false)}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {displayedPosts.length > 0 && (
            <div className="py-2 border-t border-[var(--border-subtle)]">
              <p className="px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text)] opacity-60">
                Blog
              </p>
              {displayedPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-5 py-2.5 hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <span className="shrink-0 w-9 h-9 rounded-md overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center">
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-sm" style={{ color: 'var(--border)' }}>
                        article
                      </span>
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-[var(--text-h)] line-clamp-1">
                      {post.title}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer — ver todos los resultados */}
        {term && hasResults && (
          <button
            onClick={goToAllResults}
            className="shrink-0 px-5 py-3 border-t border-[var(--border)] text-sm font-medium text-[var(--accent)] hover:bg-[var(--bg-subtle)] transition-colors text-left"
          >
            Ver todos los resultados de "{term}" →
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default SearchModal;
