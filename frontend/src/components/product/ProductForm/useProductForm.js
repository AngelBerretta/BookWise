import { useState } from 'react';
import * as productService from '../../../services/productService';
import usePendingImageUpload from '../../../hooks/usePendingImageUpload';

const EMPTY_FIELDS = {
  title: '', author: '', price: '', category: '', description: '',
  stock: '', url: '', thumbnail: '', thumbnailPublicId: '', code: '',
  pages: '', publicationDate: '',
};

const buildInitialFields = (product) => (product ? {
  title: product.title ?? '',
  author: product.author ?? '',
  price: product.price ?? '',
  category: product.category ?? '',
  description: product.description ?? '',
  stock: product.stock ?? '',
  url: product.url ?? '',
  thumbnail: product.thumbnails?.[0] ?? '',
  thumbnailPublicId: product.thumbnailPublicId ?? '',
  code: product.code ?? '',
  pages: product.pages ?? '',
  publicationDate: product.publicationDate ?? '',
} : { ...EMPTY_FIELDS });

const validate = (fields) => {
  const e = {};
  if (!fields.title?.trim()) e.title = 'El título es obligatorio.';
  if (!fields.category) e.category = 'Seleccioná una categoría.';
  if (fields.price === '' || isNaN(Number(fields.price)) || Number(fields.price) < 0)
    e.price = 'Ingresá un precio válido (≥ 0).';
  if (fields.stock === '' || isNaN(Number(fields.stock)) || Number(fields.stock) < 0)
    e.stock = 'Ingresá un stock válido (≥ 0).';
  if (!fields.description?.trim()) e.description = 'La descripción es obligatoria.';
  if (!fields.url?.trim()) e.url = 'La URL del producto es obligatoria.';
  if (fields.pages !== '' && fields.pages !== null) {
    const p = Number(fields.pages);
    if (isNaN(p) || p < 1 || !Number.isInteger(p))
      e.pages = 'Ingresá un número de páginas válido (entero ≥ 1).';
  }
  return e;
};

/**
 * Estado, validación y submit del formulario de producto.
 * ProductForm se remonta (vía `key`) cada vez que AdminProducts abre el
 * modal para un producto distinto, así que el estado ya nace correcto.
 */
const useProductForm = ({ product, onSuccess, onLoadingChange }) => {
  const isEditing = !!product;

  const [fields, setFields] = useState(() => buildInitialFields(product));
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState(null);

  const image = usePendingImageUpload({
    initialUrl: fields.thumbnail,
    initialPublicId: fields.thumbnailPublicId,
    folder: 'product',
  });

  const setLoading = (val) => {
    setLoadingState(val);
    onLoadingChange?.(val);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    setError(null);
    try {
      const { thumbnail, thumbnailPublicId } = await image.resolveImage();

      const payload = {
        title: fields.title.trim(),
        author: fields.author.trim(),
        price: Number(fields.price),
        category: fields.category,
        description: fields.description.trim(),
        stock: Number(fields.stock),
        url: fields.url.trim(),
        code: fields.code.trim(),
        thumbnails: thumbnail?.trim() ? [thumbnail.trim()] : [],
        thumbnailPublicId: thumbnailPublicId || '',
        pages: fields.pages !== '' ? Number(fields.pages) : null,
        publicationDate: fields.publicationDate?.trim() || null,
      };

      if (isEditing) {
        await productService.updateProduct(product._id, payload);
      } else {
        await productService.createProduct(payload);
      }
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditing, fields, fieldErrors, loading, error,
    onChange, onSubmit,
    imageUploaderProps: image.imageUploaderProps,
  };
};

export default useProductForm;