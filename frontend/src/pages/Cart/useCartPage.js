import { useState } from 'react';
import useCart from '../../hooks/useCart';
import useToast from '../../hooks/useToast';

/**
 * Estado de la página del carrito: datos del carrito (vía useCart) +
 * el flujo de confirmación/loading para vaciarlo.
 */
const useCartPage = () => {
  const { products, loading, itemCount, total, clearCart } = useCart();
  const { showToast } = useToast();

  const [clearing, setClearing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClearCart = async () => {
    setClearing(true);
    try {
      await clearCart();
      showToast({ type: 'success', message: 'Carrito vaciado correctamente.' });
    } catch {
      showToast({ type: 'error', message: 'No pudimos vaciar el carrito. Intentá de nuevo.' });
    } finally {
      setClearing(false);
      setConfirmOpen(false);
    }
  };

  return {
    products, loading, itemCount, total,
    clearing, confirmOpen, setConfirmOpen, handleClearCart,
  };
};

export default useCartPage;