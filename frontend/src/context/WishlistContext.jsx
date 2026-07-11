import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as wishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, user?._id, fetchWishlist]);

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

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe usarse dentro de <WishlistProvider>');
  }
  return context;
};

export default WishlistContext;