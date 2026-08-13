import Button from '../../ui/Button';
import FormErrorBanner from '../../ui/FormErrorBanner';
import useProductForm from './useProductForm';
import ProductFormFields from './ProductFormFields';

const ProductForm = ({
  product, onSuccess, onCancel,
  formId = 'product-form', showActions = true, onLoadingChange,
}) => {
  const {
    isEditing, fields, fieldErrors, loading, error,
    onChange, onSubmit, imageUploaderProps,
  } = useProductForm({ product, onSuccess, onLoadingChange });

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormErrorBanner message={error} />

      <ProductFormFields
        fields={fields}
        fieldErrors={fieldErrors}
        onChange={onChange}
        product={product}
        imageUploaderProps={imageUploaderProps}
      />

      {showActions && (
        <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProductForm;