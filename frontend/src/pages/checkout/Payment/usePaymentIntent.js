import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheckout from '../../../hooks/useCheckout';
import * as orderService from '../../../services/orderService';

/**
 * Recupera/crea el pedido en curso y su PaymentIntent de Stripe.
 * Redirige si no hay pedido guardado, o si el pedido ya está pagado.
 */
const usePaymentIntent = () => {
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

  // Si el pedido ya está pagado (ej: volvió con "atrás" tras pagar), no
  // tiene sentido mostrar el formulario de pago de nuevo.
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

  const isLoading = loadingOrder || (order && order.status !== 'paid' && !intentError && !clientSecret);

  return { order, isLoading, clientSecret, intentError, handlePaid };
};

export default usePaymentIntent;