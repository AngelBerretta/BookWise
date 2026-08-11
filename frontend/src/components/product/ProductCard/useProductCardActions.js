import { useState } from 'react';
import useCart from '../../../hooks/useCart';
import useAuth from '../../../hooks/useAuth';
import useWishlist from '../../../hooks/useWishlist';
import useToast from '../../../hooks/useToast';

/**
 * Hook compartido por ProductCard y WishlistItem: agrega al carrito y
 * togglea favoritos con los mismos mensajes de toast y manejo de errores.
 */
const useProductCardActions = (product) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [adding, setAdding] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const { _id, title, stock } = product ?? {};
  const saved = isSaved(_id);

  const handleAddToCart = async (e) => {
    e?.preventDefault();
    if (!isAuthenticated) {
      showToast({ type: 'warning', message: 'Iniciá sesión para agregar al carrito.' });
      return;
    }
    if (stock === 0) return;
    setAdding(true);
    try {
      await addToCart(_id, 1);
      showToast({ type: 'success', message: `"${title}" agregado al carrito.` });
    } catch (err) {
      if (err?.status === 401) return;
      const msg = err?.response?.data?.message
        || 'No pudimos agregar el producto. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!isAuthenticated) {
      showToast({ type: 'warning', message: 'Iniciá sesión para guardar favoritos.' });
      return;
    }
    setTogglingWishlist(true);
    try {
      const result = await toggleWishlist(_id, title);
      if (result?.added) {
        showToast({ type: 'success', message: `"${title}" agregado a favoritos` });
      }
      return result;
    } catch (err) {
      if (err?.status === 401) return;
      const msg = err?.response?.data?.message
        || 'No pudimos actualizar tus favoritos. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
    } finally {
      setTogglingWishlist(false);
    }
  };

  return {
    saved,
    adding,
    togglingWishlist,
    handleAddToCart,
    handleToggleWishlist,
    toggleWishlist,
    showToast,
    isAuthenticated,
    addToCart,
  };
};

export default useProductCardActions;