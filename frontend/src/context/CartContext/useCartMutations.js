import { useCallback } from 'react';
import * as cartService from '../../services/cartService';

/** Mutaciones simples del carrito: agregar, eliminar ítem, vaciar. */
const useCartMutations = ({ cartId, setConfirmedCart, cancelPendingQuantity, cancelAllPendingQuantities }) => {
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!cartId) return;
    const data = await cartService.addProduct(cartId, productId, quantity);
    setConfirmedCart(data);
  }, [cartId, setConfirmedCart]);

  const removeItem = useCallback(async (productId) => {
    if (!cartId) return;
    cancelPendingQuantity(productId);
    const data = await cartService.removeCart(cartId, productId);
    setConfirmedCart(data);
  }, [cartId, cancelPendingQuantity, setConfirmedCart]);

  const clearCart = useCallback(async () => {
    if (!cartId) return;
    cancelAllPendingQuantities();
    const data = await cartService.clearCart(cartId);
    setConfirmedCart(data);
  }, [cartId, cancelAllPendingQuantities, setConfirmedCart]);

  return { addToCart, removeItem, clearCart };
};

export default useCartMutations;