import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import OrderSummaryCard from '../../../components/checkout/OrderSummaryCard';

const ConfirmationSuccess = ({ order }) => (
  <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
    <Card>
      <div className="w-14 h-14 rounded-full bg-[var(--secondary-bg)] flex items-center justify-center mb-4">
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-7 h-7 text-[var(--secondary-text)]">
          <path
            fillRule="evenodd"
            d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <h1 className="h1-editorial text-2xl mb-1">¡Gracias por tu compra!</h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Pedido <span className="font-mono text-[var(--text-h)]">{order.orderNumber}</span> confirmado.
        Te enviamos los detalles a{' '}
        <span className="text-[var(--text-h)]">{order.shippingAddress?.email}</span>.
      </p>

      <div className="rounded-lg border border-[var(--border-subtle)] p-4 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-h)] mb-2">Envío a</h2>
        <p className="text-sm text-[var(--text)] leading-relaxed">
          {order.shippingAddress?.fullName}
          <br />
          {order.shippingAddress?.address}, {order.shippingAddress?.city}
          <br />
          {order.shippingAddress?.province} ({order.shippingAddress?.postalCode}),{' '}
          {order.shippingAddress?.country}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/products">
          <Button>Seguir comprando</Button>
        </Link>
        <Link to="/">
          <Button variant="secondary">Volver al inicio</Button>
        </Link>
      </div>
    </Card>

    <OrderSummaryCard
      items={order.items}
      subtotal={order.subtotal}
      shippingCost={order.shippingCost}
      total={order.total}
      heading="Detalle del pedido"
    />
  </div>
);

export default ConfirmationSuccess;