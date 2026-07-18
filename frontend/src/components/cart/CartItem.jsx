import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Fila de un ítem dentro del carrito.
 *
 * @param {{ item: { product: Object, quantity: number } }} props
 *   item.product  → datos del libro (title, author, price, thumbnail, _id)
 *   item.quantity → cantidad actual en el carrito
 */
const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  const [updatingQty, setUpdatingQty] = useState(false);
  const [removing, setRemoving]       = useState(false);

  const { product, quantity } = item;
  const { _id, title, author, price, thumbnails, url, stock } = product ?? {};

  const thumbnail = thumbnails?.[0] || url || '';

  const maxQty = Math.min(stock ?? 99, 10);

  // Distingue si el límite lo pone el stock real o el tope de 10 por compra —
  // determina el tono del mensaje (urgencia vs. política de la tienda).
  const stockLimited = (stock ?? 99) < 10;
  const atMaxQty     = quantity >= maxQty;

  /* ── Handlers ── */
  const handleQuantity = async (newQty) => {
    if (newQty < 1 || newQty > maxQty) return;
    setUpdatingQty(true);
    try {
      await updateQuantity(_id, newQty);
    } catch (err) {
      const msg = err?.response?.data?.message
        || 'No pudimos actualizar la cantidad. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
    } finally {
      setUpdatingQty(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeItem(_id);
    } catch (err) {
      const msg = err?.response?.data?.message
        || 'No pudimos eliminar el producto. Intentá de nuevo.';  
      showToast({ type: 'error', message: msg }); 
    } finally {
      setRemoving(false);
    }
  };

  const isDisabled = updatingQty || removing;

  return (
      <article className="flex gap-4 py-5 border-b border-[var(--border)] last:border-b-0">

        {/* Imagen */}
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
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-8 h-8 text-[var(--border)]"
            >
              <rect x="4" y="3" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="10" y="3" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-subtle)" />
              <line x1="13" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="13" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="13" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </Link>

        {/* Info + controles */}
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

            {/* Precio unitario */}
            <span className="text-sm font-medium text-[var(--text)] shrink-0 whitespace-nowrap">
              {formatPrice(price, false)} c/u
            </span>
          </div>

          {/* Selector cantidad + botón eliminar + subtotal */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 flex-wrap">

              {/* Selector +/− */}
              <div className={`flex items-center rounded-lg border border-[var(--border)] overflow-hidden transition-opacity ${isDisabled ? 'opacity-50' : ''}`}>
                <button
                  onClick={() => handleQuantity(quantity - 1)}
                  disabled={isDisabled || quantity <= 1}
                  className="px-2.5 py-1.5 text-[var(--text)] hover:bg-[var(--code-bg)] disabled:cursor-not-allowed transition-colors text-base leading-none"
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <span className="px-3 py-1.5 text-sm font-semibold text-[var(--text-h)] border-x border-[var(--border)] min-w-[2.5rem] text-center tabular-nums">
                  {updatingQty ? '…' : quantity}
                </span>
                <button
                  onClick={() => handleQuantity(quantity + 1)}
                  disabled={isDisabled || quantity >= maxQty}
                  className="px-2.5 py-1.5 text-[var(--text)] hover:bg-[var(--code-bg)] disabled:cursor-not-allowed transition-colors text-base leading-none"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              {/* Eliminar */}
              <Button
                variant="ghost"
                size="sm"
                loading={removing}
                onClick={handleRemove}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2"
                aria-label="Eliminar del carrito"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path
                    fillRule="evenodd"
                    d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Eliminar</span>
              </Button>

              {/* Subtotal */}
              <span className="ml-auto text-sm font-bold text-[var(--text-h)] tabular-nums">
                {formatPrice(price * quantity, false)}
              </span>
            </div>
          </div>

          {/* Aviso de límite alcanzado */}
          {atMaxQty && (
            <p
              role="status"
              className="text-xs text-amber-600 dark:text-amber-400"
            >
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