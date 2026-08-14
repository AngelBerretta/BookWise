import { Link } from 'react-router-dom';
import useCart from '../../../hooks/useCart';
import { CartIcon } from '../../ui/icons/NavIcons';
import CountBadge from '../../ui/CountBadge';

const NavbarMobileCartButton = () => {
  const { itemCount } = useCart();
  return (
    <Link
      to="/cart"
      aria-label={`Carrito — ${itemCount} ${itemCount === 1 ? 'ítem' : 'ítems'}`}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors"
    >
      <CartIcon />
      <CountBadge count={itemCount} />
    </Link>
  );
};

export default NavbarMobileCartButton;