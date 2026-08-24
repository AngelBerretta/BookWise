import { Link } from 'react-router-dom';
import Textarea from '../../../../components/ui/Textarea';
import Button from '../../../../components/ui/Button';
import ShippingContactFields from './ShippingContactFields';
import ShippingLocationFields from './ShippingLocationFields';

const ShippingAddressForm = ({ fields, fieldErrors, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
    <ShippingContactFields fields={fields} fieldErrors={fieldErrors} onChange={onChange} />
    <ShippingLocationFields fields={fields} fieldErrors={fieldErrors} onChange={onChange} />

    <Textarea
      label="Notas para la entrega (opcional)"
      name="notes"
      value={fields.notes}
      onChange={onChange}
      placeholder="Timbre, referencias, horarios, etc."
      rows={3}
    />

    <div className="flex items-center justify-between gap-4 pt-2">
      <Link
        to="/cart"
        className="text-sm font-medium text-[var(--text)] hover:text-[var(--text-h)] transition-colors"
      >
        ← Volver al carrito
      </Link>
      <Button type="submit" disabled={loading} loading={loading}>
        Continuar al pago
      </Button>
    </div>
  </form>
);

export default ShippingAddressForm;