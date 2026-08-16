import { useCallback } from 'react';
import * as orderService from '../../services/orderService';
import { addressKey, orderIdKey } from './storageKeys';

/** Acciones del checkout — mutan estado y persisten en sessionStorage por usuario. */
const useCheckoutActions = ({ userId, setShippingAddressState, setOrder }) => {
  const setShippingAddress = useCallback((address) => {
    setShippingAddressState(address);
    if (userId) {
      try {
        sessionStorage.setItem(addressKey(userId), JSON.stringify(address));
      } catch {
        // no crítico
      }
    }
  }, [userId, setShippingAddressState]);

  // Crea el pedido a partir del carrito + dirección de envío. Recibe
  // `address` como parámetro explícito (no el state interno) para evitar
  // una closure obsoleta cuando se llama justo después de
  // setShippingAddress en el mismo submit — setState no es sincrónico.
  const startOrder = useCallback(async (cartId, address) => {
    const newOrder = await orderService.createOrder(cartId, address);
    setOrder(newOrder);
    if (userId && newOrder?._id) {
      try {
        sessionStorage.setItem(orderIdKey(userId), newOrder._id);
      } catch {
        // no crítico
      }
    }
    return newOrder;
  }, [userId, setOrder]);

  // Vuelve a pedir el pedido al backend (Confirmación necesita el estado
  // real, no el que quedó en memoria antes de pagar).
  const refreshOrder = useCallback(async (orderId) => {
    const refreshed = await orderService.getOrder(orderId);
    setOrder(refreshed);
    return refreshed;
  }, [setOrder]);

  // Id de pedido persistido — usado para recuperar el flujo si el usuario
  // refresca /checkout/payment o /checkout/confirmation.
  const restoreOrderId = useCallback(() => {
    if (!userId) return null;
    try {
      return sessionStorage.getItem(orderIdKey(userId));
    } catch {
      return null;
    }
  }, [userId]);

  const clearCheckout = useCallback(() => {
    setShippingAddressState(null);
    setOrder(null);
    if (userId) {
      try {
        sessionStorage.removeItem(addressKey(userId));
        sessionStorage.removeItem(orderIdKey(userId));
      } catch {
        // no crítico
      }
    }
  }, [userId, setShippingAddressState, setOrder]);

  return { setShippingAddress, startOrder, refreshOrder, restoreOrderId, clearCheckout };
};

export default useCheckoutActions;