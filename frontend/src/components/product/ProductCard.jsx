import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Toast from '../ui/Toast';

const ProductCard = ({ product }) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [adding, setAdding]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [imgError, setImgError] = useState(false);

  const { _id, title, author, price, category, thumbnails, stock } = product;

  const thumbnail = thumbnails?.[0];

  const outOfStock = stock === 0;

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style:               'currency',
    currency:            'ARS',
    maximumFractionDigits: 0,
  }).format(price);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setToast({ type: 'warning', message: 'Iniciá sesión para agregar al carrito.' });
      return;
    }
    if (outOfStock) return;
    setAdding(true);
    try {
      await addToCart(_id, 1);
      setToast({ type: 'success', message: `"${title}" agregado al carrito.` });
    } catch {
      setToast({ type: 'error', message: 'No pudimos agregar el producto. Intentá de nuevo.' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <article className="group flex flex-col gap-4">

        {/* ── Portada ── */}
        <Link to={`/products/${_id}`} className="block">
          <div
            className="relative rounded-lg p-6 flex justify-center items-center
                       aspect-[3/4] overflow-hidden"
            style={{ backgroundColor: 'var(--bw-surface-container-low, #f5f3ee)' }}
          >
            {thumbnail && !imgError ? (
              <img
                src={thumbnail}
                alt={`Portada de ${title}`}
                onError={() => setImgError(true)}
                className="w-4/5 h-auto object-cover rounded-md
                           group-hover:-translate-y-2 transition-transform duration-500"
                style={{ boxShadow: '0 12px 40px rgba(27,28,25,0.12)' }}
              />
            ) : (
              <BookCoverPlaceholder title={title} />
            )}

            {/* Sin stock overlay */}
            {outOfStock && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center
                              rounded-lg">
                <span
                  className="font-label text-xs font-medium px-3 py-1 rounded-sm"
                  style={{
                    backgroundColor: 'rgba(251,249,244,0.90)',
                    color: 'var(--bw-primary)',
                  }}
                >
                  Sin stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* ── Info ── */}
        <div className="flex flex-col gap-1">

          {/* Categoría */}
          {category && (
            <p
              className="font-body text-xs tracking-wider uppercase"
              style={{ color: 'var(--bw-on-surface-variant, #44474c)' }}
            >
              {category}
            </p>
          )}

          {/* Título */}
          <Link to={`/products/${_id}`}>
            <h3
              className="font-headline text-xl leading-tight transition-colors duration-200"
              style={{
                color:      'var(--bw-primary, #041627)',
                fontFamily: "'Newsreader', Georgia, serif",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--bw-secondary, #3b6934)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--bw-primary, #041627)')}
            >
              {title}
            </h3>
          </Link>

          {/* Autor */}
          {author && (
            <p
              className="font-body text-sm"
              style={{ color: 'var(--bw-on-surface-variant)' }}
            >
              por {author}
            </p>
          )}

          {/* Precio + botón agregar */}
          <div className="flex justify-between items-center mt-2 gap-2">
            <span
              className="font-body font-medium"
              style={{ color: 'var(--bw-primary)' }}
            >
              {formattedPrice}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock || adding}
              className="flex items-center gap-1.5 font-label text-xs font-medium
                        px-3 py-1.5 rounded-sm transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: outOfStock
                  ? 'transparent'
                  : 'var(--bw-primary)',
                color: outOfStock
                  ? 'var(--bw-on-surface-variant)'
                  : 'var(--bw-on-primary, #ffffff)',
                border: outOfStock
                  ? '1px solid var(--bw-outline-variant, #c4c6cd)'
                  : 'none',
              }}
              onMouseEnter={e => {
                if (!outOfStock && !adding)
                  e.currentTarget.style.backgroundColor = 'var(--bw-primary-container, #1a2b3c)';
              }}
              onMouseLeave={e => {
                if (!outOfStock && !adding)
                  e.currentTarget.style.backgroundColor = 'var(--bw-primary, #041627)';
              }}
            >
              {adding ? (
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  {outOfStock ? 'remove_shopping_cart' : 'add_shopping_cart'}
                </span>
              )}
              {outOfStock ? 'Sin stock' : 'Agregar'}
            </button>
          </div>

        </div>
      </article>
    </>
  );
};

/* ── Placeholder sin thumbnail ── */
const BookCoverPlaceholder = ({ title }) => (
  <div
    className="w-4/5 aspect-[3/4] rounded-md flex flex-col items-center
               justify-center gap-2 p-4 text-center
               group-hover:-translate-y-2 transition-transform duration-500"
    style={{ backgroundColor: 'var(--bw-surface-container-high, #eae8e3)' }}
  >
    <span
      className="material-symbols-outlined"
      style={{ fontSize: '40px', color: 'var(--bw-outline, #74777d)' }}
    >
      menu_book
    </span>
    <span
      className="font-body text-xs line-clamp-2"
      style={{ color: 'var(--bw-on-surface-variant)' }}
    >
      {title}
    </span>
  </div>
);

export default ProductCard;