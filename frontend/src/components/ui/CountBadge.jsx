/**
 * Numerito flotante sobre un ícono (carrito, wishlist, etc).
 * Único punto de verdad para su estilo.
 */
const CountBadge = ({ count }) => {
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

export default CountBadge;
