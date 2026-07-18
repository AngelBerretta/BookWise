import { createContext, useState, useEffect, useCallback } from 'react';
import * as wishlistService from '../services/wishlistService';
import useAuth from '../hooks/useAuth';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading]   = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data.wishlist ?? []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Reset inmediato al des-autenticarse. Se ajusta durante el render (no en
  // un efecto) para evitar el setState síncrono al inicio del efecto.
  const [prevIsAuthenticated, setPrevIsAuthenticated] = useState(isAuthenticated);
  if (isAuthenticated !== prevIsAuthenticated) {
    setPrevIsAuthenticated(isAuthenticated);
    if (!isAuthenticated) setWishlist([]);
  }

  // Carga automática al autenticarse. La lógica se define acá adentro
  // (en vez de llamar a fetchWishlist) para que el efecto sea autocontenido:
  // fetchWishlist queda disponible como API pública para refetch manual.
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;
    const loadWishlist = async () => {
      setLoading(true);
      try {
        const data = await wishlistService.getWishlist();
        if (!ignore) setWishlist(data.wishlist ?? []);
      } catch {
        if (!ignore) setWishlist([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadWishlist();

    return () => { ignore = true; };
  }, [isAuthenticated, user?._id]);

  const isSaved = useCallback(
    (productId) => wishlist.some((p) => p._id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(async (productId) => {
    const alreadySaved = wishlist.some((p) => p._id === productId);
    setLoading(true);
    try {
      const data = alreadySaved
        ? await wishlistService.removeFromWishlist(productId)
        : await wishlistService.addToWishlist(productId);
      setWishlist(data.wishlist ?? []);
    } finally {
      setLoading(false);
    }
  }, [wishlist]);

  const value = {
    wishlist,
    loading,
    isSaved,
    toggleWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;