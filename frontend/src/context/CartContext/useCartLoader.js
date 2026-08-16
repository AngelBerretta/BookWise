import { useCallback, useEffect } from 'react';
import * as cartService from '../../services/cartService';
import { isStaleCartId } from './cartHelpers';

/**
 * Carga (o crea) el carrito del usuario autenticado. Expone `fetchCart`
 * para refetch manual, y dispara la misma carga automáticamente al
 * loguearse (o cambiar de cuenta).
 */
const useCartLoader = ({ isAuthenticated, user, setLoading, setConfirmedCart, setCartId }) => {
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?._id) return;
    setLoading(true);
    try {
      const savedCartId = localStorage.getItem(`cartId_${user._id}`);

      if (savedCartId) {
        try {
          const data = await cartService.getCart(savedCartId);
          setConfirmedCart(data);
          setCartId(savedCartId);
          return;
        } catch (err) {
          if (isStaleCartId(err)) localStorage.removeItem(`cartId_${user._id}`);
        }
      }

      const newCart = await cartService.createCart();
      const id = newCart?.cart?._id || newCart?._id;
      if (id) {
        localStorage.setItem(`cartId_${user._id}`, id);
        setCartId(id);
        setConfirmedCart(newCart);
      }
    } catch (err) {
      console.error('Error al cargar/crear carrito:', err);
      setConfirmedCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, setLoading, setConfirmedCart, setCartId]);

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
              setConfirmedCart(data);
              setCartId(savedCartId);
            }
            return;
          } catch (err) {
            if (isStaleCartId(err)) localStorage.removeItem(`cartId_${userId}`);
          }
        }

        const newCart = await cartService.createCart();
        const id = newCart?.cart?._id || newCart?._id;
        if (id && !ignore) {
          localStorage.setItem(`cartId_${userId}`, id);
          setCartId(id);
          setConfirmedCart(newCart);
        }
      } catch (err) {
        console.error('Error al cargar/crear carrito:', err);
        if (!ignore) setConfirmedCart(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadCart();

    return () => { ignore = true; };
  }, [isAuthenticated, user, setLoading, setConfirmedCart, setCartId]);

  return fetchCart;
};

export default useCartLoader;