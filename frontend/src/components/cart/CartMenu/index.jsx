import { Link } from 'react-router-dom';
import useCart from '../../../hooks/useCart';
import useDropdownMenu from '../../../hooks/useDropdownMenu';
import { CartIcon } from '../../ui/icons/NavIcons';
import CountBadge from '../../ui/CountBadge';
import CartMenuEmpty from './CartMenuEmpty';
import CartMenuItem from './CartMenuItem';
import CartMenuFooter from './CartMenuFooter';

/**
 * Ícono + badge + dropdown de resumen del carrito.
 * Solo para desktop — en mobile el ícono lleva directo a /cart (ver Navbar).
 */
const CartMenu = () => {
  const { products, itemCount, total } = useCart();
  const { open, rootRef, close, toggle } = useDropdownMenu();

  const visibleItems = products.slice(0, 4);
  const remaining = products.length - visibleItems.length;

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={toggle}
        aria-label={`Carrito — ${itemCount} ${itemCount === 1 ? 'ítem' : 'ítems'}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors duration-150"
      >
        <CartIcon />
        <CountBadge count={itemCount} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Resumen del carrito"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-lg)] z-50 overflow-hidden"
        >
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

          {products.length === 0 ? (
            <CartMenuEmpty />
          ) : (
            <>
              <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                {visibleItems.map(({ product, quantity }) => (
                  <CartMenuItem
                    key={product?._id}
                    product={product}
                    quantity={quantity}
                    onClick={close}
                  />
                ))}
              </ul>
              <CartMenuFooter remaining={remaining} total={total} onNavigate={close} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartMenu;