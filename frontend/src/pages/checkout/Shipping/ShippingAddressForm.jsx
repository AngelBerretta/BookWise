import { Link } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';

const ShippingAddressForm = ({ fields, fieldErrors, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
    <Input
      label="Nombre completo"
      name="fullName"
      value={fields.fullName}
      onChange={onChange}
      error={fieldErrors.fullName}
      placeholder="Juan Pérez"
      autoComplete="name"
    />

    <div className="grid sm:grid-cols-2 gap-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={fields.email}
        onChange={onChange}
        error={fieldErrors.email}
        placeholder="vos@email.com"
        autoComplete="email"
      />
      <Input
        label="Teléfono"
        name="phone"
        value={fields.phone}
        onChange={onChange}
        error={fieldErrors.phone}
        placeholder="11 2345 6789"
        autoComplete="tel"
      />
    </div>

    <Input
      label="Dirección"
      name="address"
      value={fields.address}
      onChange={onChange}
      error={fieldErrors.address}
      placeholder="Av. Siempre Viva 742"
      autoComplete="street-address"
    />

    <div className="grid sm:grid-cols-3 gap-4">
      <Input
        label="Ciudad"
        name="city"
        value={fields.city}
        onChange={onChange}
        error={fieldErrors.city}
        autoComplete="address-level2"
      />
      <Input
        label="Provincia"
        name="province"
        value={fields.province}
        onChange={onChange}
        error={fieldErrors.province}
        autoComplete="address-level1"
      />
      <Input
        label="Código postal"
        name="postalCode"
        value={fields.postalCode}
        onChange={onChange}
        error={fieldErrors.postalCode}
        autoComplete="postal-code"
      />
    </div>

    <Input
      label="País"
      name="country"
      value={fields.country}
      onChange={onChange}
      error={fieldErrors.country}
      autoComplete="country-name"
    />

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