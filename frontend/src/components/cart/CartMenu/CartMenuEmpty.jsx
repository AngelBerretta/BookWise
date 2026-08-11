import { CartIcon } from '../../ui/icons/NavIcons';

const CartMenuEmpty = () => (
  <div className="px-4 py-10 flex flex-col items-center text-center gap-2">
    <CartIcon className="w-8 h-8 text-[var(--text-muted)]" />
    <p className="text-sm text-[var(--text)]">Tu carrito está vacío</p>
  </div>
);

export default CartMenuEmpty;