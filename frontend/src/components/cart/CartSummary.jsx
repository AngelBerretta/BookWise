import { useState } from 'react';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

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
  const [toast, setToast] = useState(null);

  const fmt = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  const handleCheckout = () => {
    setToast({ type: 'info', message: '🚀 Próximamente: checkout disponible.' });
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={4000}
        />
      )}

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
                  {fmt(subtotal)}
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
            <span className="tabular-nums">{fmt(total)}</span>
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
            {fmt(total)}
          </span>
        </div>

        {/* Botón checkout */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleCheckout}
        >
          Finalizar compra
        </Button>

        {/* Nota seguridad */}
        <p className="text-xs text-center text-[var(--text)] opacity-60 flex items-center justify-center gap-1">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
            <path
              fillRule="evenodd"
              d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
              clipRule="evenodd"
            />
          </svg>
          Pago seguro y encriptado
        </p>

      </div>
    </>
  );
};

export default CartSummary;