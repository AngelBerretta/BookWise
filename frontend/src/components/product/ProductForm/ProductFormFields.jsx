import { PRODUCT_CATEGORIES } from '../../../utils/constants';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Textarea from '../../ui/Textarea';
import ImageUploader from '../../ui/ImageUploader';

const ProductFormFields = ({ fields, fieldErrors, onChange, product, imageUploaderProps }) => (
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

    <Select
      label="Categoría *"
      name="category"
      value={fields.category}
      onChange={onChange}
      error={fieldErrors.category}
      placeholder="Seleccioná una categoría"
      options={PRODUCT_CATEGORIES}
    />

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

    <div className="sm:col-span-2">
      <ImageUploader
        key={product?._id || 'new'}
        label="Imagen de portada"
        {...imageUploaderProps}
      />
    </div>

    <Textarea
      label="Descripción *"
      name="description"
      rows={4}
      placeholder="Sinopsis o descripción del libro…"
      value={fields.description}
      onChange={onChange}
      error={fieldErrors.description}
      className="sm:col-span-2"
    />
  </div>
);

export default ProductFormFields;