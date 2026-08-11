import { Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutStepper from '../../../components/checkout/CheckoutStepper';
import OrderSummaryCard from '../../../components/checkout/OrderSummaryCard';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import usePaymentIntent from './usePaymentIntent';
import PaymentForm from './PaymentForm';
import { stripePromise, getStripeAppearance, PUBLISHABLE_KEY } from './stripeConfig';

/**
 * Paso 3 del checkout — pago con tarjeta vía Stripe (modo test).
 * Crea/recupera el PaymentIntent del pedido y monta Stripe Elements.
 */
const Payment = () => {
  const { order, isLoading, clientSecret, intentError, handlePaid } = usePaymentIntent();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) return null; // ya redirigido

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
      <CheckoutStepper currentStep={3} />

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <Card>
          <h1 className="h1-editorial text-2xl mb-1">Pago</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Pedido <span className="font-mono">{order.orderNumber}</span>
          </p>

          {!PUBLISHABLE_KEY ? (
            <p className="text-sm rounded-lg px-3 py-2 bg-[var(--error-bg)] text-[var(--error-text)]">
              Stripe no está configurado en el frontend. Definí{' '}
              <span className="font-mono">VITE_STRIPE_PUBLISHABLE_KEY</span> en el <code>.env</code>{' '}
              del frontend.
            </p>
          ) : intentError ? (
            <p className="text-sm rounded-lg px-3 py-2 bg-[var(--error-bg)] text-[var(--error-text)]">
              {intentError}
            </p>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: getStripeAppearance() }}>
              <PaymentForm order={order} onPaid={handlePaid} />
            </Elements>
          ) : null}

          <div className="pt-4">
            <Link
              to="/checkout/shipping"
              className="text-sm font-medium text-[var(--text)] hover:text-[var(--text-h)] transition-colors"
            >
              ← Volver a envío
            </Link>
          </div>
        </Card>

        <OrderSummaryCard
          items={order.items}
          subtotal={order.subtotal}
          shippingCost={order.shippingCost}
          total={order.total}
        />
      </div>
    </div>
  );
};

export default Payment;