import Input from '../../../../components/ui/Input';

const ShippingLocationFields = ({ fields, fieldErrors, onChange }) => (
  <>
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
  </>
);

export default ShippingLocationFields;