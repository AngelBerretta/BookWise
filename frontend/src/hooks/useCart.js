import { useCart as useCartContext } from '../context/CartContext';

/**
 * Hook de carrito para uso en componentes.
 * Re-exporta CartContext con una interfaz limpia y nombres explícitos.
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
  } = useCartContext();

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