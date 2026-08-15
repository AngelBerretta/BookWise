import Textarea from '../../../ui/Textarea';
import ImageUploader from '../../../ui/ImageUploader';

const ProductFormMediaFields = ({ fields, fieldErrors, onChange, product, imageUploaderProps }) => (
  <>
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
  </>
);

export default ProductFormMediaFields;