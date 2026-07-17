import api from './api';
import { stripMarkdown } from '../utils/markdown';

/**
 * Servicio del blog
 */

export const getPosts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.limit) params.append('limit', filters.limit);
  if (filters.page) params.append('page', filters.page);
  if (filters.search) params.append('search', filters.search);
  if (filters.published !== undefined) params.append('published', filters.published);

  const queryString = params.toString();
  const url = queryString ? `/blog?${queryString}` : '/blog';

  const response = await api.get(url);
  return response.data;
};

export const getPostBySlug = async (slug, signal) => {
  const response = await api.get(`/blog/${slug}`, { signal });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/blog', postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await api.put(`/blog/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/blog/${id}`);
  return response.data;
};

export const searchPosts = async (searchTerm) => {
  return getPosts({ search: searchTerm });
};

export const getRecentPosts = async (limit = 5) => {
  return getPosts({ limit });
};

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
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateExcerpt = (content, maxLength = 160) => {
  if (!content) return '';

  const plainText = stripMarkdown(content);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
};

export const bulkDeletePosts = async (ids) => {
  const response = await api.delete('/blog/bulk', { data: { ids } });
  return response.data;
};

export const bulkUpdatePosts = async (ids, published) => {
  const response = await api.patch('/blog/bulk/publish', { ids, published });
  return response.data;
};