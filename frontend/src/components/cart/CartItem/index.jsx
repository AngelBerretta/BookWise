import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatPrice';
import useCartItemActions from './useCartItemActions';
import CartItemControls from './CartItemControls';

/**
 * Fila de un ítem dentro del carrito.
 *
 * @param {{ item: { product: Object, quantity: number } }} props
 */
const CartItem = ({ item }) => {
  const {
    removing, savingForLater, isLeaving,
    maxQty, stockLimited, atMaxQty, quantityPending,
    qtyControlsDisabled, isDisabled,
    handleQuantity, handleRemove, handleSaveForLater, handleExitEnd,
    isSaved,
  } = useCartItemActions(item);

  const { product, quantity } = item;
  const { _id, title, author, price, thumbnails, url, stock } = product ?? {};
  const thumbnail = thumbnails?.[0] || url || '';

  return (
    <article
      className={`cart-item-exit flex gap-4 py-5 border-b border-[var(--border)] last:border-b-0 ${isLeaving ? 'is-leaving' : ''}`}
      onTransitionEnd={handleExitEnd}
    >
      <Link
        to={`/products/${_id}`}
        className="shrink-0 w-20 h-28 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Portada de ${title}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-[var(--border)]">
            <rect x="4" y="3" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="3" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-subtle)" />
            <line x1="13" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/products/${_id}`}
              className="text-sm font-semibold text-[var(--text-h)] hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug"
            >
              {title}
            </Link>
            {author && (
              <p className="text-xs text-[var(--text)] mt-0.5 truncate">{author}</p>
            )}
          </div>
          <span className="text-sm font-medium text-[var(--text)] shrink-0 whitespace-nowrap">
            {formatPrice(price, false)} c/u
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <CartItemControls
            quantity={quantity}
            price={price}
            maxQty={maxQty}
            quantityPending={quantityPending}
            qtyControlsDisabled={qtyControlsDisabled}
            isDisabled={isDisabled}
            onQuantityChange={handleQuantity}
            saved={isSaved(_id)}
            savingForLater={savingForLater}
            onSaveForLater={handleSaveForLater}
            removing={removing}
            onRemove={handleRemove}
          />
        </div>

        {atMaxQty && (
          <p role="status" className="text-xs text-amber-600 dark:text-amber-400">
            {stockLimited
              ? `Solo quedan ${stock} ${stock === 1 ? 'unidad' : 'unidades'} disponibles`
              : 'Alcanzaste el máximo de 10 unidades por compra'}
          </p>
        )}
      </div>
    </article>
  );
};

export default CartItem;