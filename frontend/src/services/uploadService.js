import api from './api';

/**
 * Sube una imagen al backend, que la reenvía a Cloudinary
 * y devuelve la URL ya optimizada (quality/format automáticos).
 *
 * @param {File} file
 * @param {'product'|'post'} type - determina la carpeta destino en Cloudinary
 */
export const uploadImage = async (file, type = 'product') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);

  const response = await api.post('/uploads/image', formData, {
    // Importante: pisar el 'application/json' default de la instancia
    // para que axios setee el boundary correcto de multipart.
    headers: { 'Content-Type': undefined },
  });

  return response.data; // { status, url, publicId }
};