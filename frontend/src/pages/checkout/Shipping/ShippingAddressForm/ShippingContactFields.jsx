import Input from '../../../../components/ui/Input';

const ShippingContactFields = ({ fields, fieldErrors, onChange }) => (
  <>
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
  </>
);

export default ShippingContactFields;