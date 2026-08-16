import { useState, useRef, useCallback } from 'react';

/** Estado base del carrito + helper para confirmar contra el server. */
const useCartCore = (isAuthenticated) => {
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(null);
  // `loading` representa SOLO la carga inicial del carrito (fetch/creación
  // al entrar a la app). addToCart/updateQuantity/removeItem/clearCart NO
  // lo tocan — antes compartían este mismo booleano global, así que un
  // solo click en "+" ponía en loading a TODA la UI del carrito (badge,
  // resumen, otros ítems, etc.), no solo al control que el usuario tocó.
  const [loading, setLoading] = useState(() => isAuthenticated);

  // Último estado del carrito CONFIRMADO por el server (no un estado
  // optimista). Es la base a la que volvemos si un update de cantidad
  // falla — el rollback siempre parte de acá, nunca de un estado
  // optimista intermedio que todavía no fue validado por el backend.
  const confirmedCartRef = useRef(null);

  // ⚠️ Memoizado con deps estables (setCart es un setState, confirmedCartRef
  // es un ref — ambos garantizados estables por React). Es CRÍTICO que esto
  // mantenga siempre la misma identidad entre renders: se pasa como
  // dependencia a los useCallback/useEffect de useCartLoader,
  // useQuantityUpdater y useCartMutations. Si esta función cambiara de
  // identidad en cada render, esos efectos/callbacks se recrearían sin
  // parar — el efecto de auto-carga de useCartLoader entraría en loop
  // infinito (fetch → setState → re-render → efecto de nuevo → fetch...).
  const setConfirmedCart = useCallback((data) => {
    const nextCart = data?.cart ?? data?.payload ?? data ?? null;
    confirmedCartRef.current = nextCart;
    setCart(nextCart);
    return nextCart;
  }, []);

  return { cart, setCart, cartId, setCartId, loading, setLoading, confirmedCartRef, setConfirmedCart };
};

export default useCartCore;