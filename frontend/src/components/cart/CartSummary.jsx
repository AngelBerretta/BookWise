import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
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
  const { showToast } = useToast();

  const handleCheckout = () => {
    showToast({
      type: 'info',
      message: '🚀 El checkout todavía está en desarrollo — por ahora podés seguir agregando libros.',
      duration: 4000,
    });
  };

  return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 flex flex-col gap-5 sticky top-24">

        <h2 className="text-lg font-semibold text-[var(--text-h)]">
          Resumen del pedido
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

        {/* Totales */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-[var(--text)]">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
            <span className="tabular-nums">{formatPrice(total, false)}</span>
          </div>
          <div className="flex justify-between text-[var(--text)]">
            <span>Envío</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Gratis</span>
          </div>
        </div>

        {/* Total final */}
        <div className="flex justify-between items-center border-t border-[var(--border)] pt-4">
          <span className="font-semibold text-[var(--text-h)]">Total</span>
          <span className="text-xl font-bold text-[var(--text-h)] tabular-nums">
            {formatPrice(total, false)}
          </span>
        </div>

        {/* Botón checkout */}
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleCheckout}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '18px' }}
              aria-hidden="true"
            >
              schedule
            </span>
            Finalizar compra
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              Beta
            </span>
          </Button>
          <p className="text-xs text-center text-[var(--text)] opacity-60">
            El pago está en desarrollo — todavía no procesamos compras reales.
          </p>
        </div>

      </div>
  );
};

export default CartSummary;