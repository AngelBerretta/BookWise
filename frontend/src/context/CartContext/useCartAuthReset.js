import { useState, useEffect } from 'react';

/**
 * Al cerrar sesión (o cambiar de usuario): limpia cart/cartId al vuelo
 * (derivado durante el render) y, en un efecto — ahí sí se pueden tocar
 * refs — cancela cualquier update de cantidad pendiente y suelta la
 * referencia del último carrito confirmado.
 */
const useCartAuthReset = ({
  isAuthenticated, user, setCart, setCartId, confirmedCartRef, cancelAllPendingQuantities,
}) => {
  const authKey = isAuthenticated ? (user?._id ?? null) : null;
  const [prevAuthKey, setPrevAuthKey] = useState(authKey);

  if (authKey !== prevAuthKey) {
    setPrevAuthKey(authKey);
    if (!authKey) {
      setCart(null);
      setCartId(null);
    }
  }

  useEffect(() => {
    if (!authKey) {
      cancelAllPendingQuantities();
      confirmedCartRef.current = null;
    }
  }, [authKey, cancelAllPendingQuantities, confirmedCartRef]);

  return authKey;
};

export default useCartAuthReset;