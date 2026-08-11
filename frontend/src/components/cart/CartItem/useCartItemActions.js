import { useState } from 'react';
import useCart from '../../../hooks/useCart';
import useWishlist from '../../../hooks/useWishlist';
import useToast from '../../../hooks/useToast';

/**
 * Toda la lógica de una fila del carrito: cantidad (optimistic UI),
 * guardar para después, eliminar, y la animación de salida compartida
 * por ambas acciones.
 */
const useCartItemActions = (item) => {
  const { updateQuantity, removeItem, isQuantityPending } = useCart();
  const { toggleWishlist, isSaved } = useWishlist();
  const { showToast } = useToast();

  const [removing, setRemoving] = useState(false);
  const [savingForLater, setSavingForLater] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { product, quantity } = item;
  const { _id, title, stock } = product ?? {};

  const maxQty = Math.min(stock ?? 99, 10);
  const stockLimited = (stock ?? 99) < 10;
  const atMaxQty = quantity >= maxQty;

  // Optimistic UI: el número que se ve ya es la cantidad "deseada" — se
  // actualiza al instante en cada click, sin esperar al server.
  const quantityPending = isQuantityPending(_id);

  const handleQuantity = (newQty) => {
    if (newQty < 1 || newQty > maxQty) return;
    updateQuantity(_id, newQty).catch((err) => {
      const msg = err?.message
        || 'No pudimos actualizar la cantidad. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
    });
  };

  const handleRemove = () => {
    setRemoving(true);
    setIsLeaving(true);
  };

  const handleSaveForLater = async () => {
    setSavingForLater(true);
    try {
      const alreadySaved = isSaved(_id);
      if (!alreadySaved) {
        await toggleWishlist(_id, title);
      }
      showToast({
        type: 'success',
        message: alreadySaved
          ? `"${title}" ya estaba en tu wishlist. Lo sacamos del carrito.`
          : `Guardamos "${title}" para después. Lo encontrás en tu wishlist.`,
      });
      setIsLeaving(true);
    } catch (err) {
      const msg = err?.message
        || 'No pudimos guardar el producto para después. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
      setSavingForLater(false);
    }
  };

  const handleExitEnd = async (e) => {
    if (e.target !== e.currentTarget || !isLeaving) return;
    try {
      await removeItem(_id);
    } catch (err) {
      const msg = err?.message
        || 'No pudimos eliminar el producto. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
      setIsLeaving(false);
    } finally {
      setRemoving(false);
      setSavingForLater(false);
    }
  };

  // No se deshabilitan por `quantityPending`: ese es el punto del
  // optimistic UI. Sí se deshabilitan si el ítem se está yendo.
  const qtyControlsDisabled = removing || savingForLater;
  const isDisabled = qtyControlsDisabled || quantityPending;

  return {
    removing, savingForLater, isLeaving,
    maxQty, stockLimited, atMaxQty, quantityPending,
    qtyControlsDisabled, isDisabled,
    handleQuantity, handleRemove, handleSaveForLater, handleExitEnd,
    isSaved,
  };
};

export default useCartItemActions;