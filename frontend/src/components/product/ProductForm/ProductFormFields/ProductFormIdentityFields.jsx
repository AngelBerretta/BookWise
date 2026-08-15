import Input from '../../../ui/Input';

const ProductFormIdentityFields = ({ fields, fieldErrors, onChange }) => (
  <>
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
  </>
);

export default ProductFormIdentityFields;