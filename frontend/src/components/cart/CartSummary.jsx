import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Panel lateral con el resumen del pedido.
 *
 * @param {{
 *   products: Array,
 *   total: number,
 *   itemCount: number,
 * }} props
 */
const CartSummary = ({ products, total, itemCount }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout/shipping');
  };

  return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 flex flex-col gap-5 sticky top-24">

        <h2 className="text-lg font-semibold text-[var(--text-h)]">
          Resumen del pedido{' '}
          <span className="font-normal text-base opacity-60">
            ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
          </span>
        </h2>

        {/* Desglose por ítem */}
        <ul className="flex flex-col gap-3">
          {products.map(({ product, quantity }) => {
            const subtotal = (product?.price ?? 0) * quantity;
            return (
              <li
                key={product?._id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="text-[var(--text)] leading-snug line-clamp-2 flex-1">
                  {product?.title}
                  <span className="text-[var(--text)] opacity-60 ml-1">×{quantity}</span>
                </span>
                <span className="font-medium text-[var(--text-h)] shrink-0 tabular-nums">
                  {formatPrice(subtotal, false)}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Separador */}
        <div className="border-t border-[var(--border)]" />

        {/* Envío — el subtotal se sacó de acá: como el envío siempre es
            gratis, sería el mismo número que el Total de abajo, sin aportar
            nada nuevo. La cantidad de artículos ya se ve en el encabezado. */}
        <div className="flex justify-between text-sm text-[var(--text)]">
          <span>Envío</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Gratis</span>
        </div>

        {/* Total final */}
        <div className="flex justify-between items-center border-t border-[var(--border)] pt-4">
          <span className="font-semibold text-[var(--text-h)]">Total</span>
          <span className="text-xl font-bold text-[var(--text-h)] tabular-nums"
            aria-live="polite"
          >
            {formatPrice(total, false)}
          </span>
        </div>

        {/* Botón checkout */}
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleCheckout}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '18px' }}
              aria-hidden="true"
            >
              lock
            </span>
            Finalizar compra
          </Button>
          <p className="text-xs text-center text-[var(--text)] opacity-60">
            Pago seguro con Stripe (modo test) — no se realiza ningún cobro real.
          </p>
        </div>

      </div>
  );
};

export default CartSummary;