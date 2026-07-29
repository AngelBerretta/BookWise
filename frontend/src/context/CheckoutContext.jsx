import { createContext, useState, useCallback } from 'react';
import * as orderService from '../services/orderService';
import useAuth from '../hooks/useAuth';

const CheckoutContext = createContext(null);

// Claves de sessionStorage — por usuario, igual que `cartId_${userId}` en
// CartContext. sessionStorage (no localStorage) a propósito: el checkout es
// un flujo corto, no tiene sentido que sobreviva días entre visitas.
const addressKey = (userId) => `checkout_address_${userId}`;
const orderIdKey = (userId) => `checkout_orderId_${userId}`;

const loadSavedAddress = (userId) => {
  if (!userId) return null;
  try {
    const raw = sessionStorage.getItem(addressKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // sessionStorage no disponible o dato corrupto — no es crítico
  }
};

/**
 * Estado compartido entre los pasos del checkout (Envío → Pago →
 * Confirmación). Persiste la dirección y el id del pedido en sessionStorage
 * para que un refresh accidental en /checkout/payment no tire todo el
 * progreso del usuario.
 */
export const CheckoutProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = isAuthenticated ? user?._id : null;

  const [shippingAddress, setShippingAddressState] = useState(null);
  const [order, setOrder] = useState(null);
  // Sentinel (no `null`/`undefined`) para poder distinguir "todavía no
  // sincronizamos con ningún usuario" de "el usuario es null" (deslogueado).
  const [syncedUserId, setSyncedUserId] = useState('__unset__');

  // Al loguearse (o cambiar de cuenta) recuperamos lo que haya quedado
  // persistido para ESE usuario — nunca el de una sesión anterior de otra
  // cuenta en el mismo navegador. Reseteo derivado durante el render (en
  // vez de un useEffect) siguiendo el patrón que recomienda React para
  // "resetear estado cuando cambia una prop/valor externo" — evita el
  // round-trip extra de un efecto disparando otro render.
  if (userId !== syncedUserId) {
    setSyncedUserId(userId);
    setShippingAddressState(loadSavedAddress(userId));
    setOrder(null);
  }

  const setShippingAddress = useCallback(
    (address) => {
      setShippingAddressState(address);
      if (userId) {
        try {
          sessionStorage.setItem(addressKey(userId), JSON.stringify(address));
        } catch {
          // no crítico
        }
      }
    },
    [userId]
  );

  // Crea el pedido en el backend a partir del carrito + la dirección de
  // envío. Recibe `shippingAddress` como parámetro explícito (en vez de leer
  // el state interno) para evitar una closure obsoleta cuando se llama justo
  // después de setShippingAddress en el mismo submit — setState no es
  // sincrónico, así que el `shippingAddress` del contexto todavía no se
  // habría actualizado a tiempo.
  const startOrder = useCallback(
    async (cartId, address) => {
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
    },
    [userId]
  );

  // Vuelve a pedir el pedido al backend (Confirmación necesita el estado
  // real, no el que quedó en memoria antes de pagar).
  const refreshOrder = useCallback(async (orderId) => {
    const refreshed = await orderService.getOrder(orderId);
    setOrder(refreshed);
    return refreshed;
  }, []);

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
  }, [userId]);

  const value = {
    shippingAddress,
    order,
    setShippingAddress,
    startOrder,
    refreshOrder,
    restoreOrderId,
    clearCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContext;
