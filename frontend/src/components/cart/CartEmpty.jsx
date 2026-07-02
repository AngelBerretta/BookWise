import { Link } from 'react-router-dom';
import Button from '../ui/Button';

/**
 * Estado vacío del carrito de compras.
 */
const CartEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 gap-6">

      {/* Ícono carrito vacío */}
      <div className="flex items-center justify-center w-28 h-28 rounded-full bg-[var(--code-bg)]">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 text-[var(--text)] opacity-40"
        >
          {/* Carrito */}
          <path
            d="M6 8h6l6 28h28l6-20H18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ruedas */}
          <circle cx="26" cy="54" r="3" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="44" cy="54" r="3" stroke="currentColor" strokeWidth="2.5" />
          {/* Tilde vacío */}
          <path
            d="M32 22v8M28 26h8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
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