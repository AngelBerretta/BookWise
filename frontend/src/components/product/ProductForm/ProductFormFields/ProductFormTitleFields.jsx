import { PRODUCT_CATEGORIES } from '../../../../utils/constants';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';

const ProductFormTitleFields = ({ fields, fieldErrors, onChange }) => (
  <>
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
  </>
);

export default ProductFormTitleFields;