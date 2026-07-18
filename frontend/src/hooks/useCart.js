import { useContext } from 'react';
import CartContext from '../context/CartContext';

/**
 * Hook de carrito para uso en componentes.
 * Consume CartContext directamente y expone una interfaz limpia y
 * nombres explícitos.
 *
 * @returns {{
 *   cart: Object|null,
 *   products: Array,
 *   loading: boolean,
 *   itemCount: number,
 *   total: number,
 *   addToCart: Function,
 *   updateQuantity: Function,
 *   removeItem: Function,
 *   clearCart: Function,
 *   fetchCart: Function,
 * }}
 */
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }

  const {
    cart,
    loading,
    itemCount,
    total,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = context;

  // products es el array de items dentro del carrito
  const products = cart?.products ?? [];

  return {
    cart,
    products,
    loading,
    itemCount,
    total,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};

export default useCart;