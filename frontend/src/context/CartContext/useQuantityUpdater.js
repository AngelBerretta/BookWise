import { useRef, useCallback } from 'react';
import * as cartService from '../../services/cartService';
import { QUANTITY_DEBOUNCE_MS, getProductId } from './cartHelpers';

/**
 * Optimistic UI real para +/− de cantidad:
 * 1) Actualiza el estado local al instante (sin esperar al server).
 * 2) Debouncea la request real: varios clicks seguidos = UNA sola
 *    request con la cantidad final.
 * 3) Un número de secuencia por producto ignora respuestas que llegan
 *    "viejas" (fuera de orden) si mientras tanto hubo otro click.
 * 4) Si la request final falla, hace rollback SOLO de ese producto a su
 *    última cantidad confirmada por el server, y rechaza la promesa para
 *    que el componente muestre el error.
 */
const useQuantityUpdater = ({ cartId, setCart, confirmedCartRef, setConfirmedCart, markPending, setPendingQtyIds }) => {
  // Mapa productId -> { seq, timer, latestQty, resolve, reject }
  // Vive en un ref (no en state): es maquinaria interna de control de
  // concurrencia, no algo que deba disparar un re-render por sí solo.
  const qtyRequestsRef = useRef(new Map());

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
  }, [setPendingQtyIds]);

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
  }, [cartId, markPending, setCart, confirmedCartRef, setConfirmedCart]);

  return { updateQuantity, cancelPendingQuantity, cancelAllPendingQuantities };
};

export default useQuantityUpdater;