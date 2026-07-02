import { useState, useEffect } from 'react';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import * as productService from '../../services/productService';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EMPTY_FIELDS = {
  title:           '',
  author:          '',
  price:           '',
  category:        '',
  description:     '',
  stock:           '',
  url:             '',
  thumbnail:       '',
  code:            '',
  pages:           '',        // ✅ nuevo
  publicationDate: '',        // ✅ nuevo
};

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const isEditing = !!product;

  const [fields, setFields]           = useState({ ...EMPTY_FIELDS });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (product) {
      setFields({
        title:           product.title           ?? '',
        author:          product.author          ?? '',
        price:           product.price           ?? '',
        category:        product.category        ?? '',
        description:     product.description     ?? '',
        stock:           product.stock           ?? '',
        url:             product.url             ?? '',
        thumbnail:       product.thumbnails?.[0] ?? '',
        code:            product.code            ?? '',
        pages:           product.pages           ?? '',   // ✅
        publicationDate: product.publicationDate ?? '',   // ✅
      });
    } else {
      setFields({ ...EMPTY_FIELDS });
    }
  }, [product]);

  /* ── Validación ── */
  const validate = () => {
    const e = {};

    if (!fields.title?.trim())
      e.title = 'El título es obligatorio.';

    if (!fields.category)
      e.category = 'Seleccioná una categoría.';

    if (fields.price === '' || isNaN(Number(fields.price)) || Number(fields.price) < 0)
      e.price = 'Ingresá un precio válido (≥ 0).';

    if (fields.stock === '' || isNaN(Number(fields.stock)) || Number(fields.stock) < 0)
      e.stock = 'Ingresá un stock válido (≥ 0).';

    if (!fields.description?.trim())
      e.description = 'La descripción es obligatoria.';

    if (!fields.url?.trim())
      e.url = 'La URL del producto es obligatoria.';

    // ✅ pages: opcional, pero si se ingresa debe ser número positivo
    if (fields.pages !== '' && fields.pages !== null) {
      const p = Number(fields.pages);
      if (isNaN(p) || p < 1 || !Number.isInteger(p))
        e.pages = 'Ingresá un número de páginas válido (entero ≥ 1).';
    }

    return e;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    const payload = {
      title:       fields.title.trim(),
      author:      fields.author.trim(),
      price:       Number(fields.price),
      category:    fields.category,
      description: fields.description.trim(),
      stock:       Number(fields.stock),
      url:         fields.url.trim(),
      code:        fields.code.trim(),
      thumbnails:  fields.thumbnail?.trim() ? [fields.thumbnail.trim()] : [],
      // ✅ Solo incluye si tienen valor
      pages:           fields.pages !== '' ? Number(fields.pages) : null,
      publicationDate: fields.publicationDate?.trim() || null,
    };

    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await productService.updateProduct(product._id, payload);
      } else {
        await productService.createProduct(payload);
      }
      onSuccess?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Error al guardar el producto.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200
                        dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Input
          label="Título *"
          name="title"
          placeholder="El nombre del libro"
          value={fields.title}
          onChange={onChange}
          error={fieldErrors.title}
          className="sm:col-span-2"
        />

        <Input
          label="Autor"
          name="author"
          placeholder="Nombre del autor"
          value={fields.author}
          onChange={onChange}
          error={fieldErrors.author}
        />

        {/* Categoría */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-h)]">
            Categoría *
          </label>
          <select
            name="category"
            value={fields.category}
            onChange={onChange}
            className={[
              'w-full rounded-lg border px-3 py-2.5 text-sm',
              'bg-[var(--bg)] text-[var(--text-h)]',
              'focus:outline-none focus:ring-2',
              fieldErrors.category
                ? 'border-red-500 focus:ring-red-400'
                : 'border-[var(--border)] focus:ring-[var(--accent)] focus:border-[var(--accent-border)]',
              'transition-colors duration-150',
            ].join(' ')}
          >
            <option value="">Seleccioná una categoría</option>
            {PRODUCT_CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {fieldErrors.category && (
            <p className="text-xs text-red-500">{fieldErrors.category}</p>
          )}
        </div>

        <Input
          label="Precio (ARS) *"
          name="price"
          type="number"
          min="0"
          step="1"
          placeholder="2500"
          value={fields.price}
          onChange={onChange}
          error={fieldErrors.price}
        />

        <Input
          label="Stock *"
          name="stock"
          type="number"
          min="0"
          step="1"
          placeholder="10"
          value={fields.stock}
          onChange={onChange}
          error={fieldErrors.stock}
        />

        {/* ✅ Pages */}
        <Input
          label="Páginas"
          name="pages"
          type="number"
          min="1"
          step="1"
          placeholder="342"
          value={fields.pages}
          onChange={onChange}
          error={fieldErrors.pages}
        />

        {/* ✅ Publication date */}
        <Input
          label="Fecha de publicación"
          name="publicationDate"
          placeholder="Feb 2015 / 2023 / Marzo 2021"
          value={fields.publicationDate}
          onChange={onChange}
          error={fieldErrors.publicationDate}
        />

        <Input
          label="Código *"
          name="code"
          placeholder="ISBN o código único"
          value={fields.code}
          onChange={onChange}
          error={fieldErrors.code}
          className="sm:col-span-2"
        />

        <Input
          label="URL del producto *"
          name="url"
          type="url"
          placeholder="https://editorial.com/libro/titulo"
          value={fields.url}
          onChange={onChange}
          error={fieldErrors.url}
          className="sm:col-span-2"
        />

        <Input
          label="URL de imagen (thumbnail)"
          name="thumbnail"
          type="url"
          placeholder="https://covers.openlibrary.org/b/isbn/..."
          value={fields.thumbnail}
          onChange={onChange}
          error={fieldErrors.thumbnail}
          className="sm:col-span-2"
        />

        {/* Descripción */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-medium text-[var(--text-h)]">
            Descripción *
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Sinopsis o descripción del libro…"
            value={fields.description}
            onChange={onChange}
            className={[
              'w-full rounded-lg border px-3 py-2.5 text-sm resize-y',
              'bg-[var(--bg)] text-[var(--text-h)]',
              'placeholder:text-[var(--text)] placeholder:opacity-60',
              'focus:outline-none focus:ring-2',
              fieldErrors.description
                ? 'border-red-500 focus:ring-red-400'
                : 'border-[var(--border)] focus:ring-[var(--accent)] focus:border-[var(--accent-border)]',
              'transition-colors duration-150',
            ].join(' ')}
          />
          {fieldErrors.description && (
            <p className="text-xs text-red-500">{fieldErrors.description}</p>
          )}
        </div>

      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>

    </form>
  );
};

export default ProductForm;