import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';
import { CartIcon } from '../ui/icons/NavIcons';
import CartBadge from '../ui/CartBadge';

/**
 * Ícono + badge + dropdown de resumen del carrito.
 * Solo para desktop — en mobile el ícono lleva directo a /cart (ver Navbar.jsx).
 */
const CartMenu = () => {
  const { products, itemCount, total } = useCart();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Cerrar al hacer click afuera o presionar Escape
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const visibleItems = products.slice(0, 4);
  const remaining = products.length - visibleItems.length;

  return (
    <div className="relative" ref={rootRef}>
      {/* Trigger — mismo look que tenía antes en NavbarUserMenu */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Carrito — ${itemCount} ${itemCount === 1 ? 'ítem' : 'ítems'}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors duration-150"
      >
        <CartIcon />
        <CartBadge count={itemCount} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Resumen del carrito"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-lg)] z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-semibold text-[var(--text-h)]">
              Mi carrito {itemCount > 0 && `(${itemCount})`}
            </h3>
            <Link
              to="/cart"
              onClick={close}
              className="text-xs font-medium text-[var(--accent)] hover:opacity-70 transition-opacity"
            >
              Ver todo
            </Link>
          </div>

          {/* Vacío */}
          {products.length === 0 ? (
            <div className="px-4 py-10 flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--text-muted)' }}>
                shopping_bag
              </span>
              <p className="text-sm text-[var(--text)]">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {/* Lista de items (máx. 4) */}
              <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                {visibleItems.map(({ product, quantity }) => {
                  const thumbnail = product?.thumbnails?.[0] || product?.url;
                  return (
                    <li key={product?._id} className="flex gap-3 px-4 py-3">
                      <Link
                        to={`/products/${product?._id}`}
                        onClick={close}
                        className="shrink-0 w-12 h-16 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center"
                      >
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={`Portada de ${product.title}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-base" style={{ color: 'var(--border)' }}>
                            menu_book
                          </span>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                        <Link
                          to={`/products/${product?._id}`}
                          onClick={close}
                          className="text-sm font-medium text-[var(--text-h)] hover:text-[var(--accent)] transition-colors line-clamp-1"
                        >
                          {product?.title}
                        </Link>
                        <span className="text-xs text-[var(--text)] opacity-70">
                          {quantity} × {formatPrice(product?.price, false)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Footer */}
              <div className="px-4 py-4 border-t border-[var(--border)] flex flex-col gap-3">
                {remaining > 0 && (
                  <p className="text-xs text-center text-[var(--text)] opacity-60">
                    +{remaining} {remaining === 1 ? 'producto más' : 'productos más'}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text)]">Total</span>
                  <span className="text-base font-bold text-[var(--text-h)] tabular-nums">
                    {formatPrice(total, false)}
                  </span>
                </div>
                <Link to="/cart" onClick={close}>
                  <Button variant="primary" size="md" className="w-full">
                    Ver carrito
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartMenu;