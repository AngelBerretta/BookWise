import { createContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';
import useAuth from '../hooks/useAuth';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [cart, setCart]       = useState(null);
  const [cartId, setCartId]   = useState(null);
  const [loading, setLoading] = useState(false);

  const products   = cart?.products ?? [];
  const itemCount  = cartService.getCartItemCount(products);
  const total      = cartService.calculateCartTotal(products);

  // Helper: un cartId guardado deja de ser válido si el carrito ya no existe
  // (404) o si ya no pertenece al usuario actual (403 — ej: sesión anterior
  // de otra persona en el mismo navegador). En ambos casos hay que
  // descartarlo y crear uno nuevo.
  const isStaleCartId = (err) => err?.status === 404 || err?.status === 403;

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?._id) return;
    setLoading(true);
    try {
      const savedCartId = localStorage.getItem(`cartId_${user._id}`);

      if (savedCartId) {
        try {
          const data = await cartService.getCart(savedCartId);
          setCart(data.cart ?? data.payload ?? data);
          setCartId(savedCartId);
          return;
        } catch (err) {
          if (isStaleCartId(err)) {
            localStorage.removeItem(`cartId_${user._id}`);
          }
        }
      }

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
            if (isStaleCartId(err)) {
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