import api from './api';

// GET /api/users/wishlist
export const getWishlist = async () => {
  try {
    const response = await api.get('/users/wishlist');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST /api/users/wishlist/:pid
export const addToWishlist = async (productId) => {
  try {
    const response = await api.post(`/users/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE /api/users/wishlist/:pid
export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/users/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};