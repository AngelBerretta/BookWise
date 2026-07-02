import { useState, useEffect } from 'react';
import * as blogService from '../../services/blogService';
import Input            from '../ui/Input';
import Button           from '../ui/Button';
import PostDetail       from './PostDetail'; // 🆕

const PostForm = ({ post, onSuccess, onCancel }) => {
  const isEditing = !!post;

  const emptyFields = {
    title:     '',
    content:   '',
    thumbnail: '',
    tags:      '',
    published: false,
  };

  const [fields, setFields]           = useState(emptyFields);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [preview, setPreview]         = useState(false); // 🆕

  useEffect(() => {
    if (post) {
      setFields({
        title:     post.title     ?? '',
        content:   post.content   ?? '',
        thumbnail: post.thumbnail ?? '',
        tags:      Array.isArray(post.tags) ? post.tags.join(', ') : '',
        published: post.published ?? false,
      });
    }
  }, [post]);

  const validate = () => {
    const e = {};
    if (!fields.title.trim())   e.title   = 'El título es obligatorio.';
    if (!fields.content.trim()) e.content = 'El contenido es obligatorio.';
    return e;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    const slug = isEditing
      ? post.slug
      : blogService.generateSlug(fields.title);

    const tagsArray = fields.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title:     fields.title.trim(),
      content:   fields.content.trim(),
      thumbnail: fields.thumbnail.trim(),
      tags:      tagsArray,
      published: fields.published,
      slug,
    };

    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await blogService.updatePost(post._id, payload);
      } else {
        await blogService.createPost(payload);
      }
      onSuccess?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Error al guardar el post.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 🆕 objeto post simulado para pasarle a PostDetail
  const previewPost = {
    title:     fields.title     || 'Sin título',
    content:   fields.content   || '',
    thumbnail: fields.thumbnail || '',
    tags:      fields.tags.split(',').map((t) => t.trim()).filter(Boolean),
    published: fields.published,
    createdAt: new Date().toISOString(),
    author:    { username: 'Vos' },
    slug:      blogService.generateSlug(fields.title),
  };

  // 🆕 vista previa
  if (preview) {
    return (
      <div className="flex flex-col gap-4">

        {/* Banner de borrador */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-amber-500 shrink-0">
            <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Esta es una vista previa. El post <strong>no está publicado</strong> todavía.
          </p>
        </div>

        {/* PostDetail con los datos del formulario */}
        <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--bg)] max-h-[60vh] overflow-y-auto">
          <PostDetail post={previewPost} />
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPreview(false)}
          >
            ← Volver a editar
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={loading}
            onClick={onSubmit}
          >
            {isEditing ? 'Guardar cambios' : 'Crear post'}
          </Button>
        </div>

      </div>
    );
  }

  // ── Formulario normal ─────────────────────────────────────────────────────
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <Input
        label="Título *"
        name="title"
        placeholder="Título del artículo"
        value={fields.title}
        onChange={onChange}
        error={fieldErrors.title}
      />

      <Input
        label="URL de imagen de portada"
        name="thumbnail"
        type="url"
        placeholder="https://..."
        value={fields.thumbnail}
        onChange={onChange}
        error={fieldErrors.thumbnail}
      />

      <Input
        label="Tags (separados por coma)"
        name="tags"
        placeholder="reseña, ficción, recomendado"
        value={fields.tags}
        onChange={onChange}
        error={fieldErrors.tags}
      />

      {/* Contenido */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--text-h)]">
          Contenido *
        </label>
        <textarea
          name="content"
          rows={10}
          placeholder="Escribí el contenido del artículo aquí…"
          value={fields.content}
          onChange={onChange}
          className={[
            'w-full rounded-lg border px-3 py-2.5 text-sm font-[var(--mono)] resize-y',
            'bg-[var(--bg)] text-[var(--text-h)]',
            'placeholder:text-[var(--text)] placeholder:opacity-60 placeholder:font-[var(--sans)]',
            'focus:outline-none focus:ring-2',
            fieldErrors.content
              ? 'border-red-500 focus:ring-red-400'
              : 'border-[var(--border)] focus:ring-[var(--accent)] focus:border-[var(--accent-border)]',
            'transition-colors duration-150',
          ].join(' ')}
        />
        {fieldErrors.content && (
          <p className="text-xs text-red-500">{fieldErrors.content}</p>
        )}
      </div>

      {/* Publicado */}
      <label className="flex items-center gap-3 cursor-pointer select-none group">
        <div className="relative">
          <input
            type="checkbox"
            name="published"
            checked={fields.published}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className={[
            'w-10 h-5 rounded-full border transition-colors duration-200',
            'peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)]',
            'bg-[var(--code-bg)] border-[var(--border)]',
          ].join(' ')} />
          <div className={[
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            'peer-checked:translate-x-5',
          ].join(' ')} />
        </div>
        <span className="text-sm font-medium text-[var(--text-h)]">
          {fields.published ? 'Publicado' : 'Borrador'}
        </span>
      </label>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        {/* 🆕 Vista previa — valida antes de mostrar */}
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={() => {
            const errs = validate();
            if (Object.keys(errs).length) {
              setFieldErrors(errs);
              return;
            }
            setPreview(true);
          }}
        >
          Vista previa
        </Button>

        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Guardar cambios' : 'Crear post'}
        </Button>
      </div>

    </form>
  );
};

export default PostForm;