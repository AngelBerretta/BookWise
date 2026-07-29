import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Barra fija inferior (solo mobile) con el total del carrito y CTA de checkout.
 * Se oculta a partir de `sm:` porque en desktop ya está el CartSummary visible.
 *
 * @param {{
 *   total: number,
 *   itemCount: number,
 *   disabled?: boolean,
 * }} props
 */
const MobileCheckoutBar = ({ total, itemCount, disabled = false }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout/shipping');
  };

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)]"
      style={{
        backgroundColor: 'var(--bg)',
        boxShadow: '0 -4px 20px rgba(4, 22, 39, 0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      role="region"
      aria-label="Resumen y checkout"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[11px] text-[var(--text)] opacity-60 truncate">
            {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
          </span>
          <span
            className="text-lg font-bold text-[var(--text-h)] tabular-nums"
            aria-live="polite"
          >
            {formatPrice(total, false)}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="shrink-0"
          disabled={disabled}
          onClick={handleCheckout}
        >
          <span className="sm:hidden">Comprar</span>
          <span className="hidden sm:inline">Finalizar compra</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileCheckoutBar;