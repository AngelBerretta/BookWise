import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import * as orderService from '../../../services/orderService';
import Button from '../../../components/ui/Button';
import { formatPrice } from '../../../utils/formatPrice';
import TestModeHint from './TestModeHint';

/** Formulario interno de pago — necesita estar dentro de <Elements>. */
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
        <p role="alert" className="text-sm rounded-lg px-3 py-2 bg-[var(--error-bg)] text-[var(--error-text)]">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={!stripe || submitting} loading={submitting} className="w-full justify-center">
        Pagar {formatPrice(order.total)}
      </Button>
    </form>
  );
};

export default PaymentForm;