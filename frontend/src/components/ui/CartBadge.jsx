/**
 * Numerito flotante sobre el ícono de carrito.
 * Único punto de verdad para su estilo — usado en CartMenu (desktop)
 * y en el botón rápido de carrito en mobile (Navbar.jsx).
 */
const CartBadge = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <span
      aria-hidden="true"
      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-[var(--accent)] rounded-full leading-none"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default CartBadge;