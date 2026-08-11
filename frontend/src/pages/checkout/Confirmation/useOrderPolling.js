import { useEffect, useState, useCallback, useRef } from 'react';
import useCheckout from '../../../hooks/useCheckout';
import useCart from '../../../hooks/useCart';
import * as orderService from '../../../services/orderService';

const MAX_POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

const evaluateStatus = (order) => {
  if (!order) return 'not_found';
  if (order.status === 'paid') return 'paid';
  if (order.status === 'failed') return 'failed';
  return 'pending';
};

const useOrderPolling = () => {
  const { order, refreshOrder, restoreOrderId, clearCheckout } = useCheckout();
  const { fetchCart } = useCart();

  const [orderId] = useState(() => order?._id ?? restoreOrderId());
  const [status, setStatus] = useState(() => (orderId ? 'loading' : 'not_found'));
  const [currentOrder, setCurrentOrder] = useState(order ?? null);
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);
  const cartClearedRef = useRef(false);

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
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const checkNow = useCallback(async () => {
    if (!orderId) return;
    setChecking(true);
    try {
      await orderService.confirmOrder(orderId).catch(() => null);
      const refreshed = await refreshOrder(orderId);
      setCurrentOrder(refreshed);
      setStatus(evaluateStatus(refreshed));
    } finally {
      setChecking(false);
    }
  }, [orderId, refreshOrder]);

  useEffect(() => {
    if (status !== 'pending' || attempts >= MAX_POLL_ATTEMPTS) return;
    const timer = setTimeout(async () => {
      await checkNow();
      setAttempts((n) => n + 1);
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [status, attempts, checkNow]);

  useEffect(() => {
    if (status === 'paid' && !cartClearedRef.current) {
      cartClearedRef.current = true;
      fetchCart();
      clearCheckout();
    }
  }, [status, fetchCart, clearCheckout]);

  const exceededAttempts = status === 'pending' && attempts >= MAX_POLL_ATTEMPTS;

  return { status, currentOrder, checking, checkNow, exceededAttempts };
};

export default useOrderPolling;