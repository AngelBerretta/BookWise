import { createContext } from 'react';
import useAuth from '../../hooks/useAuth';
import useCheckoutSync from './useCheckoutSync';
import useCheckoutActions from './useCheckoutActions';

const CheckoutContext = createContext(null);

/**
 * Estado compartido entre los pasos del checkout (Envío → Pago →
 * Confirmación). Persiste la dirección y el id del pedido en sessionStorage
 * para que un refresh accidental en /checkout/payment no tire todo el
 * progreso del usuario.
 */
export const CheckoutProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = isAuthenticated ? user?._id : null;

  const { shippingAddress, setShippingAddressState, order, setOrder } = useCheckoutSync(userId);
  const { setShippingAddress, startOrder, refreshOrder, restoreOrderId, clearCheckout } =
    useCheckoutActions({ userId, setShippingAddressState, setOrder });

  const value = {
    shippingAddress, order,
    setShippingAddress, startOrder, refreshOrder, restoreOrderId, clearCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContext;