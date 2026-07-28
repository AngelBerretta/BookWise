import api from './api';

/**
 * Servicio del carrito de compras
 */

// POST /api/carts — crear carrito
export const createCart = async () => {
    const response = await api.post('/carts');
    return response.data;
};

// GET /api/carts/:cid — obtener carrito
export const getCart = async (cartId) => {
    const response = await api.get(`/carts/${cartId}`);
    return response.data;
};

// POST /api/carts/:cid/products/:pid — agregar producto
export const addProduct = async (cartId, productId, quantity = 1) => {
    const response = await api.post(`/carts/${cartId}/products/${productId}`, { quantity });
    return response.data;
};

// PUT /api/carts/:cid/products/:pid — actualizar cantidad
export const updateItem = async (cartId, productId, quantity) => {
    const response = await api.put(`/carts/${cartId}/products/${productId}`, { quantity });
    return response.data;
};

// DELETE /api/carts/:cid/products/:pid — eliminar producto
export const removeCart = async (cartId, productId) => {
    const response = await api.delete(`/carts/${cartId}/products/${productId}`);
    return response.data;
};

// DELETE /api/carts/:cid — vaciar carrito
export const clearCart = async (cartId) => {
    const response = await api.delete(`/carts/${cartId}`);
    return response.data;
};

// ── Helpers (no tocan la API) ──

export const incrementQuantity = async (cartId, productId, currentQuantity) => {
  return updateItem(cartId, productId, currentQuantity + 1);
};

export const decrementQuantity = async (cartId, productId, currentQuantity) => {
  if (currentQuantity <= 1) {
    return removeCart(cartId, productId);
  }
  return updateItem(cartId, productId, currentQuantity - 1);
};

export const calculateCartTotal = (products) => {
  if (!products || !Array.isArray(products)) return 0;
  return products.reduce((total, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);
};

export const getCartItemCount = (products) => {
  if (!products || !Array.isArray(products)) return 0;
  return products.reduce((count, item) => count + (item.quantity || 0), 0);
};

// 🆕 Categoría más frecuente del carrito — usada por el cross-sell
// ("También te puede interesar"). Se pondera por CANTIDAD, no por
// cantidad de líneas distintas: 3 unidades de un libro de "poesia" pesan
// más que 1 unidad de "ensayo", porque reflejan mejor el interés real de
// compra. Ante un empate gana la categoría que aparece primero en el
// carrito (orden determinístico).
export const getMostFrequentCategory = (products) => {
  if (!products || !Array.isArray(products) || products.length === 0) return null;

  const counts = new Map();
  for (const item of products) {
    const category = item.product?.category;
    if (!category) continue;
    counts.set(category, (counts.get(category) || 0) + (item.quantity || 1));
  }

  let topCategory = null;
  let topCount = 0;
  for (const [category, count] of counts) {
    if (count > topCount) {
      topCategory = category;
      topCount = count;
    }
  }
  return topCategory;
};