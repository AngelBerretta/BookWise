import { createContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';
import useAuth from '../hooks/useAuth';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [cart, setCart]       = useState(null);
  const [cartId, setCartId]   = useState(null);  // Guardar el ID del carrito
  const [loading, setLoading] = useState(false);

  const products   = cart?.products ?? [];
  const itemCount  = cartService.getCartItemCount(products);
  const total      = cartService.calculateCartTotal(products);

  // Carga o crea el carrito cuando el usuario se autentica.
  // Nota: la dependencia es `user` (objeto completo) y no `user?._id`
  // porque el análisis de memoización no puede acotar de forma segura
  // una dependencia a una propiedad accedida con optional chaining.
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
  }, [isAuthenticated, user]);

  // Reset inmediato al des-autenticarse. Se ajusta durante el render (no en
  // un efecto) para evitar el setState síncrono al inicio del efecto.
  const authKey = isAuthenticated ? (user?._id ?? null) : null;
  const [prevAuthKey, setPrevAuthKey] = useState(authKey);
  if (authKey !== prevAuthKey) {
    setPrevAuthKey(authKey);
    if (!authKey) {
      setCart(null);
      setCartId(null);
    }
  }

  // Carga automática al autenticarse. La lógica se define acá adentro
  // (en vez de llamar a fetchCart) para que el efecto sea autocontenido:
  // fetchCart queda disponible como API pública para refetch manual.
  useEffect(() => {
    const userId = user?._id;
    if (!isAuthenticated || !userId) return;

    let ignore = false;
    const loadCart = async () => {
      setLoading(true);
      try {
        const savedCartId = localStorage.getItem(`cartId_${userId}`);

        if (savedCartId) {
          try {
            const data = await cartService.getCart(savedCartId);
            if (!ignore) {
              setCart(data.cart ?? data.payload ?? data);
              setCartId(savedCartId);
            }
            return;
          } catch (err) {
            if (err?.response?.status === 404) {
              localStorage.removeItem(`cartId_${userId}`);
            }
          }
        }

        const newCart = await cartService.createCart();
        const id = newCart?.cart?._id || newCart?._id;
        if (id && !ignore) {
          localStorage.setItem(`cartId_${userId}`, id);
          setCartId(id);
          setCart(newCart.cart ?? newCart);
        }
      } catch (err) {
        console.error('Error al cargar/crear carrito:', err);
        if (!ignore) setCart(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadCart();

    return () => { ignore = true; };
  }, [isAuthenticated, user]);

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
      const data = await cartService.clearCart(cartId);
      setCart(data.cart ?? data.payload ?? data);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const value = {
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

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;