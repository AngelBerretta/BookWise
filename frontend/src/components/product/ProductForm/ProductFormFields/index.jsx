import ProductFormTitleFields from './ProductFormTitleFields';
import ProductFormNumberFields from './ProductFormNumberFields';
import ProductFormIdentityFields from './ProductFormIdentityFields';
import ProductFormMediaFields from './ProductFormMediaFields';

const ProductFormFields = ({ fields, fieldErrors, onChange, product, imageUploaderProps }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <ProductFormTitleFields fields={fields} fieldErrors={fieldErrors} onChange={onChange} />
    <ProductFormNumberFields fields={fields} fieldErrors={fieldErrors} onChange={onChange} />
    <ProductFormIdentityFields fields={fields} fieldErrors={fieldErrors} onChange={onChange} />
    <ProductFormMediaFields
      fields={fields}
      fieldErrors={fieldErrors}
      onChange={onChange}
      product={product}
      imageUploaderProps={imageUploaderProps}
    />
  </div>
);

export default ProductFormFields;