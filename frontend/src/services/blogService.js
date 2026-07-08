import api from './api';
import { stripMarkdown } from '../utils/markdown';

/**
 * Servicio del blog
 */

/**
 * Obtiene todos los posts con filtros opcionales
 * @param {Object} filters - Filtros de búsqueda (limit, page, search)
 * @returns {Promise} Lista de posts
 */
export const getPosts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.limit) params.append('limit', filters.limit);
    if (filters.page) params.append('page', filters.page);
    if (filters.search) params.append('search', filters.search);
    if (filters.published !== undefined) params.append('published', filters.published);

    const queryString = params.toString();
    const url = queryString ? `/blog?${queryString}` : '/blog';

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene un post por su slug
 * @param {string} slug - Slug del post
 * @returns {Promise} Datos del post
 */
export const getPostBySlug = async (slug, signal) => {
  try {
    const response = await api.get(`/blog/${slug}`, { signal });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Crea un nuevo post (solo admin)
 * @param {Object} postData - Datos del post (title, content, excerpt, coverImage, etc.)
 * @returns {Promise} Post creado
 */
export const createPost = async (postData) => {
  try {
    const response = await api.post('/blog', postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualiza un post existente (solo admin)
 * @param {string} id - ID del post
 * @param {Object} postData - Datos actualizados
 * @returns {Promise} Post actualizado
 */
export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/blog/${id}`, postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Elimina un post (solo admin)
 * @param {string} id - ID del post
 * @returns {Promise} Respuesta del servidor
 */
export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Busca posts por texto
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise} Lista de posts
 */
export const searchPosts = async (searchTerm) => {
  return getPosts({ search: searchTerm });
};

/**
 * Obtiene los posts más recientes
 * @param {number} limit - Cantidad de posts a obtener
 * @returns {Promise} Lista de posts recientes
 */
export const getRecentPosts = async (limit = 5) => {
  return getPosts({ limit });
};

/**
 * Genera un slug a partir de un título
 * @param {string} title - Título del post
 * @returns {string} Slug generado
 */
export const generateSlug = (title) => {
  if (!title) return '';

  return title
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
};

/**
 * Extrae un excerpt del contenido
 * @param {string} content - Contenido completo
 * @param {number} maxLength - Longitud máxima del excerpt
 * @returns {string} Excerpt generado
 */
export const generateExcerpt = (content, maxLength = 160) => {
  if (!content) return '';

  const plainText = stripMarkdown(content);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Cortar en el último espacio antes de maxLength
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...' 
    : truncated + '...';
};

export const bulkDeletePosts = async (ids) => {
  try {
    const response = await api.delete('/blog/bulk', { data: { ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const bulkUpdatePosts = async (ids, published) => {
  try {
    const response = await api.patch('/blog/bulk/publish', { ids, published });
    return response.data;
  } catch (error) {
    throw error;
  }
};