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

  const [prevIsAuthenticated, setPrevIsAuthenticated] = useState(isAuthenticated);
  if (isAuthenticated !== prevIsAuthenticated) {
    setPrevIsAuthenticated(isAuthenticated);
    if (!isAuthenticated) setWishlist([]);
  }

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

  // 🆕 Ahora recibe un segundo parámetro opcional: productTitle
  const toggleWishlist = useCallback(async (productId, productTitle = '') => {
    const alreadySaved = wishlist.some((p) => p._id === productId);
    setLoading(true);
    try {
      const data = alreadySaved
        ? await wishlistService.removeFromWishlist(productId)
        : await wishlistService.addToWishlist(productId);
      setWishlist(data.wishlist ?? []);
      
      // 🆕 Devolvemos si se agregó o quitó para que el componente decida si mostrar toast
      return { added: !alreadySaved, title: productTitle };
    } catch (error) {
      throw error; // El error lo maneja el componente que llama
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