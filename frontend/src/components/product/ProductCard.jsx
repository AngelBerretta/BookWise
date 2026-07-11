import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Toast from '../ui/Toast';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product }) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [adding, setAdding]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [imgError, setImgError] = useState(false);

  const { _id, title, author, price, category, thumbnails, stock } = product;

  const thumbnail = thumbnails?.[0];

  const outOfStock = stock === 0;

  const formattedPrice = formatPrice(price, false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    console.log('Click en agregar', { isAuthenticated, outOfStock, _id });
    if (!isAuthenticated) {
      setToast({ type: 'warning', message: 'Iniciá sesión para agregar al carrito.' });
      return;
    }
    if (outOfStock) return;
    setAdding(true);
    try {
      console.log('Llamando a addToCart...');
      await addToCart(_id, 1);
      console.log('addToCart exitoso');
      setToast({ type: 'success', message: `"${title}" agregado al carrito.` });
    } catch {
      console.error('Error en addToCart:');
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

      <article className="group flex flex-col gap-4 h-full min-w-0">

        {/* ── Portada ── */}
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
        <div className="flex flex-col gap-1 flex-1 min-w-0">

          {/* Categoría */}
          {category && <Badge category={category} />}

          {/* Título */}
          <Link to={`/products/${_id}`}>
            <h3
              className="font-headline text-xl leading-tight transition-colors duration-200 line-clamp-2"
              style={{
                color:      'var(--text-h)',
                fontFamily: "'Newsreader', Georgia, serif",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--secondary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-h)')}
            >
              {title}
            </h3>
          </Link>

          {/* Autor */}
          {author && (
            <p
              className="font-body text-sm"
              style={{ color: 'var(--text)' }}
            >
              por {author}
            </p>
          )}

          {/* Precio + botón agregar */}
          <div className="flex justify-between items-center mt-auto pt-2 gap-2">
            <span
              className="font-body font-medium"
              style={{ color: 'var(--text-h)' }}
            >
              {formattedPrice}
            </span>

            <Button
              variant={outOfStock ? 'secondary' : 'primary'}
              size="sm"
              disabled={outOfStock || cartLoading}
              loading={adding}
              onClick={handleAddToCart}
            >
              {!adding && (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '14px' }}
                  aria-hidden="true"
                >
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
    </>
  );
};

/* ── Placeholder sin thumbnail ── */
const BookCoverPlaceholder = ({ title }) => (
  <div
    className="w-4/5 aspect-[3/4] rounded-md flex flex-col items-center
               justify-center gap-2 p-4 text-center
               group-hover:-translate-y-2 transition-transform duration-500"
    style={{ backgroundColor: 'var(--bg-container)' }}
  >
    <span
      className="material-symbols-outlined"
      style={{ fontSize: '40px', color: 'var(--text-muted)' }}
    >
      menu_book
    </span>
    <span
      className="font-body text-xs line-clamp-2"
      style={{ color: 'var(--text)' }}
    >
      {title}
    </span>
  </div>
);

export default ProductCard;