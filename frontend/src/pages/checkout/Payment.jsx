import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useCheckout from '../../hooks/useCheckout';
import * as orderService from '../../services/orderService';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import OrderSummaryCard from '../../components/checkout/OrderSummaryCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/formatPrice';

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = PUBLISHABLE_KEY
  ? loadStripe(PUBLISHABLE_KEY, {
      developerTools: { assistant: { enabled: false } },
    })
  : null;

// Stripe Elements corre dentro de un iframe y no puede leer nuestras
// variables CSS (--accent, --bg, etc.) — le pasamos los mismos colores
// "a mano", en claro y oscuro, para que no desentone con el resto de la app.
const getStripeAppearance = () => {
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

  return prefersDark
    ? {
        theme: 'night',
        variables: {
          colorPrimary: '#b7c8de',
          colorBackground: '#161820',
          colorText: '#f0ede6',
          colorDanger: '#ffb4ab',
          borderRadius: '8px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }
    : {
        theme: 'stripe',
        variables: {
          colorPrimary: '#041627',
          colorBackground: '#fbf9f4',
          colorText: '#041627',
          colorDanger: '#ba1a1a',
          borderRadius: '8px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      };
};

// ── Aviso de modo test ────────────────────────────────────────────────────────
const TestModeHint = () => (
  <div className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-3 text-sm text-[var(--text)]">
    <p className="font-medium text-[var(--text-h)] mb-1">💳 Pasarela de pago en modo test</p>
    <p>
      Este checkout usa Stripe en modo test — no se realiza ningún cobro real. Usá la tarjeta{' '}
      <span className="font-mono font-medium text-[var(--text-h)]">4242 4242 4242 4242</span>, cualquier
      fecha de vencimiento futura, cualquier CVC de 3 dígitos y cualquier código postal.
    </p>
  </div>
);

// ── Formulario interno (necesita estar dentro de <Elements>) ──────────────────
const PaymentForm = ({ order, onPaid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    setFormError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setFormError(error.message || 'No pudimos procesar el pago. Probá de nuevo.');
      setSubmitting(false);
      return;
    }

    // Fallback de confirmación contra el backend — no depende de que el
    // Stripe CLI esté reenviando webhooks en este entorno. Si el webhook ya
    // confirmó el pedido (o lo hace un instante después), esta llamada es
    // un no-op del lado del servidor.
    try {
      await orderService.confirmOrder(order._id);
    } catch {
      // Si esto falla, el webhook (si está configurado) va a terminar de
      // confirmar el pedido igual — la Confirmación reintenta por las dudas.
    }

    setSubmitting(false);
    onPaid(paymentIntent?.status);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <TestModeHint />

      <PaymentElement />

      {formError && (
        <p
          role="alert"
          className="text-sm rounded-lg px-3 py-2 bg-[var(--error-bg)] text-[var(--error-text)]"
        >
          {formError}
        </p>
      )}

      <Button
        type="submit"
        disabled={!stripe || submitting}
        loading={submitting}
        className="w-full justify-center"
      >
        Pagar {formatPrice(order.total)}
      </Button>
    </form>
  );
};

/**
 * Paso 3 del checkout — pago con tarjeta vía Stripe (modo test).
 * Crea/recupera el PaymentIntent del pedido y monta Stripe Elements.
 */
const Payment = () => {
  const { order, refreshOrder, restoreOrderId } = useCheckout();
  const navigate = useNavigate();

  const [loadingOrder, setLoadingOrder] = useState(!order);
  const [clientSecret, setClientSecret] = useState(null);
  const [intentError, setIntentError] = useState(null);

  // Si el usuario refrescó la página, `order` (en memoria) se perdió — lo
  // recuperamos con el id que sí persiste en sessionStorage.
  useEffect(() => {
    const restore = async () => {
      if (order) {
        setLoadingOrder(false);
        return;
      }
      const savedId = restoreOrderId();
      if (!savedId) {
        navigate('/checkout/shipping', { replace: true });
        return;
      }
      try {
        await refreshOrder(savedId);
      } catch {
        navigate('/checkout/shipping', { replace: true });
      } finally {
        setLoadingOrder(false);
      }
    };
    restore();
  }, [order, restoreOrderId, refreshOrder, navigate]);

  // Si el pedido ya está pagado (ej: volvió con el botón "atrás" después de
  // pagar), no tiene sentido mostrar el formulario de pago de nuevo.
  useEffect(() => {
    if (order?.status === 'paid') {
      navigate('/checkout/confirmation', { replace: true });
    }
  }, [order, navigate]);

  useEffect(() => {
    if (!order?._id || order.status === 'paid') return;
    let cancelled = false;

    orderService
      .createPaymentIntent(order._id)
      .then((data) => {
        if (!cancelled) setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        if (!cancelled) {
          setIntentError(err?.message || 'No pudimos iniciar el pago. Intentá de nuevo.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [order]);

  const handlePaid = useCallback(() => {
    navigate('/checkout/confirmation');
  }, [navigate]);

  if (loadingOrder || (order && order.status !== 'paid' && !intentError && !clientSecret)) {
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
