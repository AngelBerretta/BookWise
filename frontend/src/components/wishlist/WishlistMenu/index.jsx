import { Link } from 'react-router-dom';
import useWishlist from '../../../hooks/useWishlist';
import useDropdownMenu from '../../../hooks/useDropdownMenu';
import Button from '../../ui/Button';
import { WishlistIcon } from '../../ui/icons/NavIcons';
import CountBadge from '../../ui/CountBadge';
import WishlistMenuEmpty from './WishlistMenuEmpty';
import WishlistMenuItem from './WishlistMenuItem';

const WishlistMenu = () => {
  const { wishlist } = useWishlist();
  const { open, rootRef, close, toggle } = useDropdownMenu();

  const visibleItems = wishlist.slice(0, 4);
  const remaining = wishlist.length - visibleItems.length;

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={toggle}
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

          {wishlist.length === 0 ? (
            <WishlistMenuEmpty />
          ) : (
            <>
              <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                {visibleItems.map((product) => (
                  <WishlistMenuItem key={product?._id} product={product} onClick={close} />
                ))}
              </ul>

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