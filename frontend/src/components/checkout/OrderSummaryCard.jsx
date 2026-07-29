import Card from '../ui/Card';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Resumen de pedido de solo lectura, reutilizado en Envío, Pago y
 * Confirmación. Recibe los ítems ya normalizados a la forma
 * { title, thumbnail, price, quantity } — tanto el carrito como el pedido
 * (snapshot en el backend) exponen esa misma forma.
 *
 * @param {{
 *   items: Array<{ title: string, thumbnail?: string, price: number, quantity: number }>,
 *   subtotal: number,
 *   shippingCost?: number,
 *   total: number,
 *   heading?: string,
 * }} props
 */
const OrderSummaryCard = ({ items, subtotal, shippingCost = 0, total, heading = 'Resumen del pedido' }) => {
  return (
    <Card className="sticky top-24">
      <h2 className="text-base font-semibold text-[var(--text-h)] mb-4">{heading}</h2>

      <ul className="flex flex-col gap-3 mb-4 max-h-72 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <li key={`${item.title}-${idx}`} className="flex items-center gap-3">
            <div className="w-11 h-14 shrink-0 rounded-md overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-h)] truncate">{item.title}</p>
              <p className="text-xs text-[var(--text-muted)]">Cantidad: {item.quantity}</p>
            </div>
            <span className="text-sm font-medium text-[var(--text-h)] shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between text-[var(--text)]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[var(--text)]">
          <span>Envío</span>
          <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'Gratis'}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-[var(--text-h)] pt-1.5 mt-1 border-t border-[var(--border-subtle)]">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </Card>
  );
};

export default OrderSummaryCard;
