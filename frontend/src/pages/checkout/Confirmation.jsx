import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import useCheckout from '../../hooks/useCheckout';
import useCart from '../../hooks/useCart';
import * as orderService from '../../services/orderService';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import OrderSummaryCard from '../../components/checkout/OrderSummaryCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const MAX_POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

const evaluateStatus = (order) => {
  if (!order) return 'not_found';
  if (order.status === 'paid') return 'paid';
  if (order.status === 'failed') return 'failed';
  return 'pending';
};

/**
 * Paso 4 del checkout — confirmación del pedido.
 *
 * El flujo PRINCIPAL de confirmación es el webhook de Stripe (asíncrono, ya
 * puede haber marcado el pedido como pagado para cuando llegamos acá). Como
 * red de contención para desarrollo local sin el Stripe CLI corriendo, esta
 * pantalla también reintenta el endpoint de fallback (`/orders/:oid/confirm`)
 * mientras el pedido siga en "pending_payment".
 */
const Confirmation = () => {
  const { order, refreshOrder, restoreOrderId, clearCheckout } = useCheckout();
  const { fetchCart } = useCart();

  const [orderId] = useState(() => order?._id ?? restoreOrderId());

  // loading | pending | paid | failed | not_found — si ni siquiera hay
  // orderId, ya arrancamos en "not_found" (evita un setState sincrónico
  // en el efecto de abajo solo para reflejar algo que ya sabíamos al montar).
  const [status, setStatus] = useState(() => (orderId ? 'loading' : 'not_found'));
  const [currentOrder, setCurrentOrder] = useState(order ?? null);
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);
  const cartClearedRef = useRef(false);

  // Carga inicial del pedido
  useEffect(() => {
    if (!orderId) return undefined;
    let cancelled = false;
    const load = async () => {
      try {
        const ord = await refreshOrder(orderId);
        if (cancelled) return;
        setCurrentOrder(ord);
        setStatus(evaluateStatus(ord));
      } catch {
        if (!cancelled) setStatus('not_found');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const checkNow = useCallback(async () => {
    if (!orderId) return;
    setChecking(true);
    try {
      // Reintenta el fallback server-side además del simple GET, por si la
      // llamada original desde Payment.jsx no llegó a completarse.
      await orderService.confirmOrder(orderId).catch(() => null);
      const refreshed = await refreshOrder(orderId);
      setCurrentOrder(refreshed);
      setStatus(evaluateStatus(refreshed));
    } finally {
      setChecking(false);
    }
  }, [orderId, refreshOrder]);

  // Polling automático mientras el pedido siga "pending" — cubre el margen
  // entre que el usuario paga y el webhook (o el fallback) termina de
  // reflejarlo en la base de datos.
  useEffect(() => {
    if (status !== 'pending' || attempts >= MAX_POLL_ATTEMPTS) return;

    const timer = setTimeout(async () => {
      await checkNow();
      setAttempts((n) => n + 1);
    }, POLL_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [status, attempts, checkNow]);

  // Pedido confirmado → soltamos el estado del checkout y refrescamos el
  // carrito (el backend ya lo vació al marcar el pedido como pagado).
  useEffect(() => {
    if (status === 'paid' && !cartClearedRef.current) {
      cartClearedRef.current = true;
      fetchCart();
      clearCheckout();
    }
  }, [status, fetchCart, clearCheckout]);

  const exceededAttempts = status === 'pending' && attempts >= MAX_POLL_ATTEMPTS;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
      <CheckoutStepper currentStep={4} completed={status === 'paid'} />

      {status === 'loading' && (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      )}

      {status === 'not_found' && (
        <Card className="text-center py-12">
          <h1 className="h1-editorial text-2xl mb-2">No encontramos ese pedido</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Puede que el enlace haya expirado o que el pedido pertenezca a otra cuenta.
          </p>
          <Link to="/products">
            <Button>Ir al catálogo</Button>
          </Link>
        </Card>
      )}

      {(status === 'pending' || (status === 'paid' && !currentOrder)) && (
        <Card className="text-center py-12">
          <Spinner size="lg" className="mx-auto mb-4" />
          <h1 className="h1-editorial text-2xl mb-2">Estamos confirmando tu pago…</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Esto suele tardar solo unos segundos.
          </p>
          {exceededAttempts && (
            <Button onClick={checkNow} disabled={checking} loading={checking} className="mx-auto">
              Verificar de nuevo
            </Button>
          )}
        </Card>
      )}

      {status === 'failed' && (
        <Card className="text-center py-12">
          <div className="w-14 h-14 rounded-full bg-[var(--error-bg)] flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[var(--error-text)]">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="h1-editorial text-2xl mb-2">El pago no se pudo completar</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Tu pedido{' '}
            {currentOrder?.orderNumber && <span className="font-mono">{currentOrder.orderNumber}</span>}{' '}
            no fue cobrado. Podés volver a intentarlo con otra tarjeta.
          </p>
          <Link to="/checkout/payment">
            <Button>Reintentar el pago</Button>
          </Link>
        </Card>
      )}

      {status === 'paid' && currentOrder && (
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
              Pedido <span className="font-mono text-[var(--text-h)]">{currentOrder.orderNumber}</span> confirmado.
              Te enviamos los detalles a{' '}
              <span className="text-[var(--text-h)]">{currentOrder.shippingAddress?.email}</span>.
            </p>

            <div className="rounded-lg border border-[var(--border-subtle)] p-4 mb-6">
              <h2 className="text-sm font-semibold text-[var(--text-h)] mb-2">Envío a</h2>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                {currentOrder.shippingAddress?.fullName}
                <br />
                {currentOrder.shippingAddress?.address}, {currentOrder.shippingAddress?.city}
                <br />
                {currentOrder.shippingAddress?.province} ({currentOrder.shippingAddress?.postalCode}),{' '}
                {currentOrder.shippingAddress?.country}
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
            items={currentOrder.items}
            subtotal={currentOrder.subtotal}
            shippingCost={currentOrder.shippingCost}
            total={currentOrder.total}
            heading="Detalle del pedido"
          />
        </div>
      )}
    </div>
  );
};

export default Confirmation;
