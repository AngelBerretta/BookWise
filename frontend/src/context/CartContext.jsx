import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import * as cartService from '../services/cartService';
import useAuth from '../hooks/useAuth';

const CartContext = createContext(null);

// Tiempo de espera tras el último click en +/− antes de mandar la request
// real. Si el usuario clickea varias veces seguidas, se debounca todo eso
// en UNA sola request con la cantidad final (menos carga al server y evita
// condiciones de carrera por respuestas que llegan fuera de orden).
const QUANTITY_DEBOUNCE_MS = 450;

// Extrae el id de producto de un item del carrito, sea que venga populado
// ({ product: {...}, quantity }) o no (fallback por las dudas).
const getProductId = (item) => item.product?._id ?? item._id;

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [cart, setCart]       = useState(null);
  const [cartId, setCartId]   = useState(null);
  // 👈 `loading` ahora representa SOLO la carga inicial del carrito
  // (fetch/creación al entrar a la app). addToCart / updateQuantity /
  // removeItem / clearCart YA NO lo tocan: antes compartían este mismo
  // booleano global, así que un solo click en "+" ponía en loading a
  // TODA la UI del carrito (badge, resumen, otros ítems, etc.), no solo
  // al control que el usuario tocó.
  const [loading, setLoading] = useState(() => isAuthenticated);
  // Ítems con una actualización de cantidad en curso (debounce pendiente
  // o request en vuelo). Se usa solo para feedback visual sutil — NO
  // bloquea los botones +/−, esa es justamente la idea del optimistic UI.
  const [pendingQtyIds, setPendingQtyIds] = useState(() => new Set());

  const products   = cart?.products ?? [];
  const itemCount  = cartService.getCartItemCount(products);
  const total      = cartService.calculateCartTotal(products);

  // Último estado del carrito CONFIRMADO por el server (no un estado
  // optimista). Es la base a la que volvemos si un update de cantidad
  // falla — el rollback siempre parte de acá, nunca de un estado
  // optimista intermedio que todavía no fue validado por el backend.
  const confirmedCartRef = useRef(null);

  const setConfirmedCart = (data) => {
    const nextCart = data?.cart ?? data?.payload ?? data ?? null;
    confirmedCartRef.current = nextCart;
    setCart(nextCart);
    return nextCart;
  };

  // Mapa productId -> { seq, timer, latestQty, resolve, reject }
  // Vive en un ref (no en state): es maquinaria interna de control de
  // concurrencia, no algo que deba disparar un re-render por sí solo.
  const qtyRequestsRef = useRef(new Map());

  const markPending = useCallback((productId, isPending) => {
    setPendingQtyIds((prev) => {
      if (isPending === prev.has(productId)) return prev;
      const next = new Set(prev);
      if (isPending) next.add(productId); else next.delete(productId);
      return next;
    });
  }, []);

  // Cancela cualquier update de cantidad pendiente/en vuelo para un
  // producto sin tratarlo como error (se usa antes de eliminar el ítem,
  // para que una request de cantidad "vieja" no reviva el ítem justo
  // después de borrarlo).
  const cancelPendingQuantity = useCallback((productId) => {
    const entry = qtyRequestsRef.current.get(productId);
    if (!entry) return;
    clearTimeout(entry.timer);
    entry.seq += 1; // invalida cualquier respuesta que llegue después
    entry.resolve?.();
    qtyRequestsRef.current.delete(productId);
    markPending(productId, false);
  }, [markPending]);

  const cancelAllPendingQuantities = useCallback(() => {
    qtyRequestsRef.current.forEach((entry) => {
      clearTimeout(entry.timer);
      entry.seq += 1;
      entry.resolve?.();
    });
    qtyRequestsRef.current.clear();
    setPendingQtyIds(new Set());
  }, []);

  const isQuantityPending = useCallback(
    (productId) => pendingQtyIds.has(productId),
    [pendingQtyIds]
  );

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
          setConfirmedCart(data);
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
        setConfirmedCart(newCart);
      }
    } catch (err) {
      console.error('Error al cargar/crear carrito:', err);
      setConfirmedCart(null);
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

  // Al cerrar sesión: cancelamos cualquier update de cantidad pendiente
  // (debounce sin disparar o request en vuelo) y soltamos la referencia
  // del último carrito confirmado. Va en un efecto — no en el bloque de
  // arriba — porque ese bloque corre durante el render, y ahí no se
  // pueden tocar refs (`qtyRequestsRef` / `confirmedCartRef`).
  useEffect(() => {
    if (!authKey) {
      const cleanupOnLogout = () => {
        cancelAllPendingQuantities();
        confirmedCartRef.current = null;
      };
      cleanupOnLogout();
    }
  }, [authKey, cancelAllPendingQuantities]);

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
  }, [isAuthenticated, user]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!cartId) return;
    const data = await cartService.addProduct(cartId, productId, quantity);
    setConfirmedCart(data);
  }, [cartId]);

  // ── Optimistic UI real para +/− de cantidad ──────────────────────────
  // 1) Actualiza el estado local al instante (sin esperar al server).
  // 2) Debouncea la request real: varios clicks seguidos = UNA sola
  //    request con la cantidad final.
  // 3) Un número de secuencia por producto ignora respuestas que llegan
  //    "viejas" (fuera de orden) si mientras tanto hubo otro click.
  // 4) Si la request final falla, hace rollback SOLO de ese producto a
  //    su última cantidad confirmada por el server, y rechaza la promesa
  //    para que el componente muestre el error.
  const updateQuantity = useCallback((productId, quantity) => {
    if (!cartId) return Promise.resolve();

    // Optimistic update — se ve reflejado en toda la UI (badge, subtotal,
    // resumen del pedido) de inmediato, no solo en el ítem clickeado.
    setCart((prev) => {
      if (!prev) return prev;
      const nextProducts = (prev.products ?? []).map((item) =>
        getProductId(item) === productId ? { ...item, quantity } : item
      );
      return { ...prev, products: nextProducts };
    });
    markPending(productId, true);

    return new Promise((resolve, reject) => {
      const requests = qtyRequestsRef.current;
      let entry = requests.get(productId);

      if (!entry) {
        entry = { seq: 0, timer: null, latestQty: quantity, resolve, reject };
        requests.set(productId, entry);
      } else {
        // Ya había un click pendiente para este mismo producto: el
        // anterior queda "superado" por este. Lo resolvemos como no-op
        // (no dispara un toast de error) — solo el resultado del ÚLTIMO
        // click importa para el usuario.
        clearTimeout(entry.timer);
        entry.resolve?.();
        entry.latestQty = quantity;
        entry.resolve = resolve;
        entry.reject = reject;
      }

      entry.seq += 1;
      const mySeq = entry.seq;

      entry.timer = setTimeout(async () => {
        entry.timer = null;
        const qtyToSend = entry.latestQty;
        try {
          const data = await cartService.updateItem(cartId, productId, qtyToSend);
          // Si mientras esta request estaba en vuelo llegó un click más
          // nuevo (seq cambió), esta respuesta ya quedó vieja: la
          // ignoramos y dejamos que la request más reciente defina el
          // estado final.
          if (entry.seq !== mySeq) return;
          const serverCart = setConfirmedCart(data);
          requests.delete(productId);
          markPending(productId, false);
          entry.resolve?.(serverCart);
        } catch (err) {
          if (entry.seq !== mySeq) return;
          // Rollback — solo del producto afectado, a su última cantidad
          // confirmada por el server. No tocamos el resto del carrito por
          // si otros ítems tienen su propio update optimista en curso.
          setCart((prev) => {
            if (!prev) return prev;
            const confirmedItem = confirmedCartRef.current?.products?.find(
              (item) => getProductId(item) === productId
            );
            const nextProducts = (prev.products ?? []).map((item) =>
              getProductId(item) === productId ? (confirmedItem ?? item) : item
            );
            return { ...prev, products: nextProducts };
          });
          requests.delete(productId);
          markPending(productId, false);
          entry.reject?.(err);
        }
      }, QUANTITY_DEBOUNCE_MS);
    });
  }, [cartId, markPending]);

  const removeItem = useCallback(async (productId) => {
    if (!cartId) return;
    cancelPendingQuantity(productId);
    const data = await cartService.removeCart(cartId, productId);
    setConfirmedCart(data);
  }, [cartId, cancelPendingQuantity]);

  const clearCart = useCallback(async () => {
    if (!cartId) return;
    cancelAllPendingQuantities();
    const data = await cartService.clearCart(cartId);
    setConfirmedCart(data);
  }, [cartId, cancelAllPendingQuantities]);

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
    isQuantityPending,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
