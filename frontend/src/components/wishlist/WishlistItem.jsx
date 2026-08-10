import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Button from '../ui/Button';
import TrashIcon from '../ui/icons/TrashIcon';
import { CartIcon } from '../ui/icons/NavIcons';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Fila de un ítem dentro de la wishlist. Imagen chica + info al costado
 * (como CartItem), pero con precio y CTA apilados verticalmente en vez
 * de repartidos en el ancho de la fila — el bloque de acción queda
 * angosto y compacto, no estirado.
 *
 * @param {{ product: Object }} props
 */
const WishlistItem = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [addingToCart, setAddingToCart] = useState(false);
  const [removing, setRemoving]         = useState(false);
  const [isLeaving, setIsLeaving]       = useState(false);

  const { _id, title, author, price, thumbnails, url, stock } = product ?? {};
  const thumbnail = thumbnails?.[0] || url || '';

  const outOfStock = stock === 0;
  const lowStock    = !outOfStock && stock > 0 && stock <= 3;

  /* ── Agregar al carrito ── */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast({ type: 'warning', message: 'Iniciá sesión para agregar al carrito.' });
      return;
    }
    if (outOfStock) return;
    setAddingToCart(true);
    try {
      await addToCart(_id, 1);
      showToast({ type: 'success', message: `"${title}" agregado al carrito.` });
    } catch (err) {
      if (err?.status === 401) return;
      const msg = err?.response?.data?.message
        || 'No pudimos agregar el producto. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
    } finally {
      setAddingToCart(false);
    }
  };

  /* ── Quitar de favoritos (con animación de salida) ── */
  const handleRemove = () => {
    setRemoving(true);
    setIsLeaving(true);
  };

  const handleExitEnd = async (e) => {
    if (e.target !== e.currentTarget || !isLeaving) return;
    try {
      await toggleWishlist(_id, title);
    } catch (err) {
      const msg = err?.message
        || 'No pudimos quitar el producto de tus favoritos. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
      setIsLeaving(false);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <article
      className={`cart-item-exit cart-item-exit--tall flex gap-4 py-6 border-b border-[var(--border)] last:border-b-0 ${isLeaving ? 'is-leaving' : ''}`}
      onTransitionEnd={handleExitEnd}
    >
      {/* Imagen — un poco más grande que en CartItem */}
      <Link
        to={`/products/${_id}`}
        className="shrink-0 w-24 h-32 sm:w-28 sm:h-40 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Portada de ${title}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 text-[var(--border)]">
            <rect x="4" y="3" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="3" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-subtle)" />
            <line x1="13" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </Link>

      {/* Info + acciones */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="min-w-0">
          <Link
            to={`/products/${_id}`}
            className="text-sm sm:text-base font-semibold text-[var(--text-h)] hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug"
          >
            {title}
          </Link>
          {author && (
            <p className="text-xs sm:text-sm text-[var(--text)] mt-0.5 truncate">{author}</p>
          )}
        </div>

        {(outOfStock || lowStock) && (
          <p className={`text-xs ${outOfStock ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
            {outOfStock ? 'Sin stock' : `¡Últimas ${stock}!`}
          </p>
        )}

        {/* Precio + acciones apiladas: bloque angosto pegado abajo */}
        <div className="mt-auto flex flex-col items-start gap-1.5">
          <span className="text-base font-bold text-[var(--text-h)] tabular-nums">
            {formatPrice(price, false)}
          </span>

          {/* Botón principal + quitar, juntos y sin estirarse */}
          <div className="flex items-center gap-2">
            <Button
              variant={outOfStock ? 'secondary' : 'primary'}
              size="sm"
              disabled={outOfStock || removing}
              loading={addingToCart}
              onClick={handleAddToCart}
            >
              {!addingToCart && <CartIcon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
             </span>
             <span className="sr-only sm:hidden">
                {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
             </span>
             <span aria-hidden="true" className="sm:hidden">
                {outOfStock ? 'Sin stock' : 'Agregar'}
             </span>
            </Button>

            <button
              onClick={handleRemove}
              disabled={addingToCart || removing}
              aria-label="Quitar de favoritos"
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default WishlistItem;