import api from './api';

export const getProducts = async (filters = {}) => {
  try {
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

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMaxPrice = async () => {
  try {
    const response = await api.get('/products/meta/max-price');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const bulkDeleteProducts = async (ids) => {
  try {
    const response = await api.delete('/products/bulk', { data: { ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getProductsByCategory = async (category) => getProducts({ category });
export const searchProducts = async (searchTerm) => getProducts({ search: searchTerm });