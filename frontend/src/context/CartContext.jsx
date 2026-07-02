import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [cart, setCart]       = useState(null);
  const [cartId, setCartId]   = useState(null);  // Guardar el ID del carrito
  const [loading, setLoading] = useState(false);

  const products   = cart?.products ?? [];
  const itemCount  = cartService.getCartItemCount(products);
  const total      = cartService.calculateCartTotal(products);

  // Carga o crea el carrito cuando el usuario se autentica
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?._id) return;
    setLoading(true);
    try {
      // Buscar si ya existe un carrito guardado en localStorage
      const savedCartId = localStorage.getItem(`cartId_${user._id}`);
      
      if (savedCartId) {
        try {
          const data = await cartService.getCart(savedCartId);
          setCart(data.cart ?? data.payload ?? data);
          setCartId(savedCartId);
          return;
        } catch (err) {
          // Si el carrito guardado no existe, crear uno nuevo
          if (err?.response?.status === 404) {
            localStorage.removeItem(`cartId_${user._id}`);
          }
        }
      }

      // Crear carrito nuevo
      const newCart = await cartService.createCart();
      const id = newCart?.cart?._id || newCart?._id;
      if (id) {
        localStorage.setItem(`cartId_${user._id}`, id);
        setCartId(id);
        setCart(newCart.cart ?? newCart);
      }
    } catch (err) {
      console.error('Error al cargar/crear carrito:', err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?._id]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchCart();
    } else {
      setCart(null);
      setCartId(null);
    }
  }, [isAuthenticated, user?._id, fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!cartId) return;
    setLoading(true);
    try {
      const data = await cartService.addProduct(cartId, productId, quantity);
      setCart(data.cart ?? data.payload ?? data);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!cartId) return;
    setLoading(true);
    try {
      const data = await cartService.updateItem(cartId, productId, quantity);
      setCart(data.cart ?? data.payload ?? data);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const removeItem = useCallback(async (productId) => {
    if (!cartId) return;
    setLoading(true);
    try {
      const data = await cartService.removeCart(cartId, productId);
      setCart(data.cart ?? data.payload ?? data);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const clearCart = useCallback(async () => {
    if (!cartId) return;
    setLoading(true);
    try {
      await cartService.clearCart(cartId);
      setCart(null);
      localStorage.removeItem(`cartId_${user?._id}`);
      setCartId(null);
    } finally {
      setLoading(false);
    }
  }, [cartId, user?._id]);

  const value = {
    cart,
    loading,
    itemCount,
    total,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return context;
};

export default CartContext;