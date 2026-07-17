import api from './api';

// GET /api/users/wishlist
export const getWishlist = async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
};

// POST /api/users/wishlist/:pid
export const addToWishlist = async (productId) => {
    const response = await api.post(`/users/wishlist/${productId}`);
    return response.data;
};

// DELETE /api/users/wishlist/:pid
export const removeFromWishlist = async (productId) => {
    const response = await api.delete(`/users/wishlist/${productId}`);
    return response.data;
};