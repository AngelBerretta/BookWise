import { useState } from 'react';
import * as blogService from '../../../services/blogService';
import usePendingImageUpload from '../../../hooks/usePendingImageUpload';

const EMPTY_FIELDS = {
  title: '', content: '', thumbnail: '', thumbnailPublicId: '',
  tags: '', published: false,
};

const buildInitialFields = (post) => (post ? {
  title: post.title ?? '',
  content: post.content ?? '',
  thumbnail: post.thumbnail ?? '',
  thumbnailPublicId: post.thumbnailPublicId ?? '',
  tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
  published: post.published ?? false,
} : { ...EMPTY_FIELDS });

const validate = (fields) => {
  const e = {};
  if (!fields.title.trim()) e.title = 'El título es obligatorio.';
  if (!fields.content.trim()) e.content = 'El contenido es obligatorio.';
  return e;
};

/**
 * Estado, validación, preview y submit del formulario de post.
 * PostForm se remonta (vía `key`) cada vez que AdminBlog abre el modal
 * para un post distinto, así que el estado ya nace correcto.
 */
const usePostForm = ({ post, onSuccess }) => {
  const isEditing = !!post;

  const [fields, setFields] = useState(() => buildInitialFields(post));
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(false);

  const image = usePendingImageUpload({
    initialUrl: fields.thumbnail,
    initialPublicId: fields.thumbnailPublicId,
    folder: 'post',
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const openPreview = () => {
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setPreview(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    const slug = blogService.generateSlug(fields.title);
    const tagsArray = fields.tags.split(',').map((t) => t.trim()).filter(Boolean);

    setLoading(true);
    setError(null);
    try {
      const { thumbnail, thumbnailPublicId } = await image.resolveImage();

      const payload = {
        title: fields.title.trim(),
        content: fields.content.trim(),
        thumbnail: thumbnail?.trim() ? thumbnail.trim() : '',
        thumbnailPublicId: thumbnailPublicId || '',
        tags: tagsArray,
        published: fields.published,
        slug,
      };

      if (isEditing) {
        await blogService.updatePost(post._id, payload);
      } else {
        await blogService.createPost(payload);
      }
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al guardar el post.');
    } finally {
      setLoading(false);
    }
  };

  const previewPost = {
    title: fields.title || 'Sin título',
    content: fields.content || '',
    thumbnail: image.previewSrc,
    tags: fields.tags.split(',').map((t) => t.trim()).filter(Boolean),
    published: fields.published,
    createdAt: new Date().toISOString(),
    author: { username: 'Vos' },
    slug: blogService.generateSlug(fields.title),
  };

  return {
    isEditing, fields, fieldErrors, loading, error, preview,
    onChange, onSubmit,
    imageUploaderProps: image.imageUploaderProps,
    openPreview, closePreview: () => setPreview(false), previewPost,
  };
};

export default usePostForm;