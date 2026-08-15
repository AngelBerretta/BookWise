import Input from '../../../ui/Input';

const ProductFormNumberFields = ({ fields, fieldErrors, onChange }) => (
  <>
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
  </>
);

export default ProductFormNumberFields;