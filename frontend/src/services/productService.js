import api from './api';

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category) params.append('query', filters.category);
  if (filters.search)   params.append('search', filters.search);
  if (filters.limit)    params.append('limit', filters.limit);
  if (filters.page)     params.append('page', filters.page);

  if (filters.sort)     params.append('sort', filters.sort);
  if (filters.minPrice !== undefined && filters.minPrice !== null)
     params.append('minPrice', filters.minPrice);
   if (filters.maxPrice !== undefined && filters.maxPrice !== null)
     params.append('maxPrice', filters.maxPrice);
  if (filters.stock)    params.append('stock', filters.stock); // 🆕 "out" | "low"

  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : '/products';

  const response = await api.get(url);
  return response.data;
};

export const getMaxPrice = async () => {
  const response = await api.get('/products/meta/max-price');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const bulkDeleteProducts = async (ids) => {
  const response = await api.delete('/products/bulk', { data: { ids } });
  return response.data;
};

export const bulkUpdateCategory = async (ids, category) => {
  const response = await api.patch('/products/bulk/category', { ids, category });
  return response.data;
};

export const getProductsByCategory = async (category) => getProducts({ category });
export const searchProducts = async (searchTerm) => getProducts({ search: searchTerm });