import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useWishlist from '../../hooks/useWishlist';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';
import { WishlistIcon } from '../ui/icons/NavIcons';
import CountBadge from '../ui/CountBadge';

/**
 * Ícono + badge + dropdown de resumen de la wishlist.
 * Solo para desktop — en mobile vive dentro del drawer (ver MobileMenu.jsx).
 */
const WishlistMenu = () => {
  const { wishlist } = useWishlist();
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
  const visibleItems = wishlist.slice(0, 4);
  const remaining = wishlist.length - visibleItems.length;

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Favoritos — ${wishlist.length} ${wishlist.length === 1 ? 'ítem' : 'ítems'}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors duration-150"
      >
        <WishlistIcon />
        <CountBadge count={wishlist.length} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Resumen de favoritos"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-lg)] z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-semibold text-[var(--text-h)]">
              Favoritos {wishlist.length > 0 && `(${wishlist.length})`}
            </h3>
            <Link
              to="/wishlist"
              onClick={close}
              className="text-xs font-medium text-[var(--accent)] hover:opacity-70 transition-opacity"
            >
              Ver todo
            </Link>
          </div>

          {/* Vacío */}
          {wishlist.length === 0 ? (
            <div className="px-4 py-10 flex flex-col items-center text-center gap-2">
              <WishlistIcon />
              <p className="text-sm text-[var(--text)]">Todavía no guardaste nada</p>
            </div>
          ) : (
            <>
              {/* Lista de items (máx. 4) */}
              <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                {visibleItems.map((product) => {
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
                          {formatPrice(product?.price, false)}
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
                <Link to="/wishlist" onClick={close}>
                  <Button variant="primary" size="md" className="w-full">
                    Ver favoritos
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

export default WishlistMenu;
