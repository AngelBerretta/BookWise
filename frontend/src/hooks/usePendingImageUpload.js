import { useState } from 'react';
import { uploadImage } from '../services/uploadService';

/**
 * Estado y resolución de una imagen que el usuario seleccionó/quitó en el
 * formulario, pero que todavía no se subió a Cloudinary. Compartido por
 * ProductForm y PostForm: en ambos, la imagen se sube recién al confirmar
 * el submit (nunca queda nada huérfano si el usuario prueba/cancela antes).
 */
const usePendingImageUpload = ({ initialUrl = '', initialPublicId = '', folder }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageRemoved, setImageRemoved] = useState(false);

  const onImageSelect = (file, previewUrl) => {
    setImageFile(file);
    setImagePreviewUrl(previewUrl || '');
    setImageRemoved(false);
  };

  const onImageRemove = () => {
    setImageFile(null);
    setImagePreviewUrl('');
    setImageRemoved(true);
  };

  /** Sube la imagen nueva si hay una pendiente; si no, respeta remove/original. */
  const resolveImage = async () => {
    if (imageFile) {
      const uploaded = await uploadImage(imageFile, folder);
      return { thumbnail: uploaded.url, thumbnailPublicId: uploaded.publicId };
    }
    if (imageRemoved) {
      return { thumbnail: '', thumbnailPublicId: '' };
    }
    return { thumbnail: initialUrl, thumbnailPublicId: initialPublicId };
  };

  // Para previews en vivo (ej. PostForm): imagen removida > preview nueva > original.
  const previewSrc = imageRemoved ? '' : (imagePreviewUrl || initialUrl || '');

  /**
   * Props listas para spreadear directamente en <ImageUploader {...imageUploaderProps} />.
   * Evita que cada formulario tenga que recordar cablear "a mano" value/onFileSelect/onRemove
   * — un error fácil de cometer es pasar el campo plano del form (ej. fields.thumbnail) en vez
   * de `previewSrc`, que es la única fuente de verdad real del estado de la imagen pendiente.
   */
  const imageUploaderProps = {
    value: previewSrc,
    onFileSelect: onImageSelect,
    onRemove: onImageRemove,
  };

  return {
    imageFile, imageRemoved, previewSrc,
    onImageSelect, onImageRemove, resolveImage,
    imageUploaderProps,
  };
};

export default usePendingImageUpload;