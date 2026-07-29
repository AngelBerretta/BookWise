import { useContext } from 'react';
import CheckoutContext from '../context/CheckoutContext';

/**
 * Hook de checkout para uso en componentes.
 * Consume CheckoutContext directamente y expone una interfaz limpia.
 *
 * @returns {{
 *   shippingAddress: Object|null,
 *   order: Object|null,
 *   setShippingAddress: Function,
 *   startOrder: Function,
 *   refreshOrder: Function,
 *   restoreOrderId: Function,
 *   clearCheckout: Function,
 * }}
 */
const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout debe usarse dentro de <CheckoutProvider>');
  }
  return context;
};

export default useCheckout;
