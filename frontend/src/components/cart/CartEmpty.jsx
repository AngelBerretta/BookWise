import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { CartIcon } from '../ui/icons/NavIcons';

/**
 * Estado vacío del carrito de compras.
 */
const CartEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-[clamp(1.5rem,8dvh,5rem)] px-6 gap-6">

      {/* Ícono carrito vacío */}
      <div className="flex items-center justify-center w-28 h-28 rounded-full bg-[var(--code-bg)]">
        <CartIcon className="w-14 h-14 text-[var(--text)] opacity-40" />
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-2 max-w-xs">
        <h2 className="text-xl font-semibold text-[var(--text-h)]">
          Tu carrito está vacío
        </h2>
        <p className="text-sm text-[var(--text)] leading-relaxed">
          Explorá nuestra colección y agregá los libros que más te interesen.
        </p>
      </div>

      {/* CTA */}
      <Link to="/products">
        <Button variant="primary" size="lg">
          Ver libros
        </Button>
      </Link>
    </div>
  );
};

export default CartEmpty;