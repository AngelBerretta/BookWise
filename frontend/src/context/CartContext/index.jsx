import { createContext } from 'react';
import * as cartService from '../../services/cartService';
import useAuth from '../../hooks/useAuth';
import useCartCore from './useCartCore';
import usePendingQuantities from './usePendingQuantities';
import useQuantityUpdater from './useQuantityUpdater';
import useCartAuthReset from './useCartAuthReset';
import useCartLoader from './useCartLoader';
import useCartMutations from './useCartMutations';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const {
    cart, setCart, cartId, setCartId, loading, setLoading,
    confirmedCartRef, setConfirmedCart,
  } = useCartCore(isAuthenticated);

  const { setPendingQtyIds, markPending, isQuantityPending } = usePendingQuantities();

  const { updateQuantity, cancelPendingQuantity, cancelAllPendingQuantities } = useQuantityUpdater({
    cartId, setCart, confirmedCartRef, setConfirmedCart, markPending, setPendingQtyIds,
  });

  useCartAuthReset({
    isAuthenticated, user, setCart, setCartId, confirmedCartRef, cancelAllPendingQuantities,
  });

  const fetchCart = useCartLoader({ isAuthenticated, user, setLoading, setConfirmedCart, setCartId });

  const { addToCart, removeItem, clearCart } = useCartMutations({
    cartId, setConfirmedCart, cancelPendingQuantity, cancelAllPendingQuantities,
  });

  const products = cart?.products ?? [];
  const itemCount = cartService.getCartItemCount(products);
  const total = cartService.calculateCartTotal(products);

  const value = {
    cart, products, loading, itemCount, total,
    fetchCart, addToCart, updateQuantity, removeItem, clearCart, isQuantityPending,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;