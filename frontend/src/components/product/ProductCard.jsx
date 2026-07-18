import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // 👈 ya no dependemos de `loading` global
  const { isAuthenticated } = useAuth();
  const { isSaved, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [adding, setAdding]               = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [imgError, setImgError]           = useState(false);

  const { _id, title, author, price, category, thumbnails, stock } = product;

  const thumbnail = thumbnails?.[0];
  const outOfStock = stock === 0;
  const lowStock   = !outOfStock && stock > 0 && stock <= 3; // 👈 bonus: aviso de stock bajo
  const saved      = isSaved(_id);

  const formattedPrice = formatPrice(price, false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast({ type: 'warning', message: 'Iniciá sesión para agregar al carrito.' });
      return;
    }
    if (outOfStock) return;
    setAdding(true);
    try {
      await addToCart(_id, 1);
      showToast({ type: 'success', message: `"${title}" agregado al carrito.` });
    } catch (err) {
      const msg = err?.response?.data?.message
        || 'No pudimos agregar el producto. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast({ type: 'warning', message: 'Iniciá sesión para guardar favoritos.' });
      return;
    }
    setTogglingWishlist(true);
    try {
      await toggleWishlist(_id);
    } catch (err) {
      const msg = err?.response?.data?.message
        || 'No pudimos actualizar tus favoritos. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
    } finally {
      setTogglingWishlist(false);
    }
  };

  return (
    <article className="group flex flex-col gap-4 h-full min-w-0">

        {/* ── Portada ── */}
        <div className="relative">
          <Link to={`/products/${_id}`} className="block">
            <div
              className="relative rounded-lg p-4 sm:p-6 flex justify-center items-center
                         aspect-[3/4] overflow-hidden"
              style={{ backgroundColor: 'var(--bg-subtle)' }}
            >
              {thumbnail && !imgError ? (
                <img
                  src={thumbnail}
                  alt={`Portada de ${title}`}
                  onError={() => setImgError(true)}
                  loading="lazy"
                  decoding="async"
                  className="w-4/5 h-auto object-cover rounded-md
                             group-hover:-translate-y-2 transition-transform duration-500"
                  style={{ boxShadow: 'var(--shadow-lg)' }}
                />
              ) : (
                <BookCoverPlaceholder title={title} />
              )}

              {outOfStock && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                  <span
                    className="font-label text-xs font-medium px-3 py-1 rounded-sm"
                    style={{ backgroundColor: 'rgba(251,249,244,0.90)', color: 'var(--bw-primary)' }}
                  >
                    Sin stock
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Botón wishlist — flotante sobre la portada */}
          <button
            onClick={handleToggleWishlist}
            disabled={togglingWishlist}
            aria-label={saved ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-pressed={saved}
            className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full
                       transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: 'rgba(251,249,244,0.90)',
              color: saved ? 'var(--accent)' : 'var(--text)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {togglingWishlist ? 'hourglass_empty' : (saved ? 'bookmark' : 'bookmark_border')}
            </span>
          </button>
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">

          <div className="flex items-center justify-between gap-2">
            {category && <Badge category={category} />}
            {lowStock && (
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 shrink-0">
                ¡Últimas {stock}!
              </span>
            )}
          </div>

          <Link to={`/products/${_id}`}>
            <h3
              className="font-headline text-xl leading-tight transition-colors duration-200 line-clamp-2 hover:text-[var(--secondary)]"
              style={{ color: 'var(--text-h)', fontFamily: "'Newsreader', Georgia, serif" }}
            >
              {title}
            </h3>
          </Link>

          {author && (
            <p className="font-body text-sm" style={{ color: 'var(--text)' }}>
              por {author}
            </p>
          )}

          <div className="flex justify-between items-center mt-auto pt-2 gap-2">
            <span className="font-body font-medium" style={{ color: 'var(--text-h)' }}>
              {formattedPrice}
            </span>

            <Button
              variant={outOfStock ? 'secondary' : 'primary'}
              size="sm"
              disabled={outOfStock}
              loading={adding}
              onClick={handleAddToCart}
            >
              {!adding && (
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }} aria-hidden="true">
                  {outOfStock ? 'remove_shopping_cart' : 'add_shopping_cart'}
                </span>
              )}
              <span className="hidden sm:inline">
                {outOfStock ? 'Sin stock' : 'Agregar'}
              </span>
              <span className="sr-only sm:hidden">
                {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
              </span>
            </Button>
          </div>

        </div>
      </article>
  );
};

const BookCoverPlaceholder = ({ title }) => (
  <div
    className="w-4/5 aspect-[3/4] rounded-md flex flex-col items-center justify-center gap-2 p-4 text-center
               group-hover:-translate-y-2 transition-transform duration-500"
    style={{ backgroundColor: 'var(--bg-container)' }}
  >
    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--text-muted)' }}>
      menu_book
    </span>
    <span className="font-body text-xs line-clamp-2" style={{ color: 'var(--text)' }}>
      {title}
    </span>
  </div>
);

export default ProductCard;