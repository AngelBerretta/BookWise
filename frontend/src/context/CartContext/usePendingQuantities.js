import { useState, useCallback } from 'react';

/**
 * Ítems con una actualización de cantidad en curso (debounce pendiente o
 * request en vuelo). Se usa solo para feedback visual sutil — NO bloquea
 * los botones +/−, esa es justamente la idea del optimistic UI.
 */
const usePendingQuantities = () => {
  const [pendingQtyIds, setPendingQtyIds] = useState(() => new Set());

  const markPending = useCallback((productId, isPending) => {
    setPendingQtyIds((prev) => {
      if (isPending === prev.has(productId)) return prev;
      const next = new Set(prev);
      if (isPending) next.add(productId); else next.delete(productId);
      return next;
    });
  }, []);

  const isQuantityPending = useCallback(
    (productId) => pendingQtyIds.has(productId),
    [pendingQtyIds]
  );

  return { setPendingQtyIds, markPending, isQuantityPending };
};

export default usePendingQuantities;