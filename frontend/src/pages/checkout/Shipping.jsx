import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useCheckout from '../../hooks/useCheckout';
import useForm from '../../hooks/useForm';
import useToast from '../../hooks/useToast';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import OrderSummaryCard from '../../components/checkout/OrderSummaryCard';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

const emptyAddress = (user) => ({
  fullName: user?.username ?? '',
  email: user?.email ?? '',
  phone: user?.phone ?? '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Argentina',
  notes: '',
});

/**
 * Paso 2 del checkout — dirección de envío.
 * Al confirmar, crea el pedido en el backend (snapshot del carrito + esta
 * dirección) y avanza a /checkout/payment.
 */
const Shipping = () => {
  const { user } = useAuth();
  const { cart, products, itemCount, loading: cartLoading, total: cartTotal } = useCart();
  const { shippingAddress, setShippingAddress, startOrder } = useCheckout();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fields, setFields] = useState(() => shippingAddress ?? emptyAddress(user));
  const [fieldErrors, setFieldErrors] = useState({});

  // Si el carrito está vacío no hay nada que enviar — de vuelta al carrito.
  useEffect(() => {
    if (!cartLoading && itemCount === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartLoading, itemCount, navigate]);

  const validate = () => {
    const errors = {};
    if (!fields.fullName.trim() || fields.fullName.trim().length < 3) {
      errors.fullName = 'Ingresá tu nombre completo.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = 'Ingresá un email válido.';
    }
    if (!fields.phone.trim() || fields.phone.trim().length < 6) {
      errors.phone = 'Ingresá un teléfono válido.';
    }
    if (!fields.address.trim() || fields.address.trim().length < 5) {
      errors.address = 'Ingresá tu dirección completa.';
    }
    if (!fields.city.trim()) errors.city = 'Ingresá tu ciudad.';
    if (!fields.province.trim()) errors.province = 'Ingresá tu provincia.';
    if (!fields.postalCode.trim()) errors.postalCode = 'Ingresá tu código postal.';
    if (!fields.country.trim()) errors.country = 'Ingresá tu país.';
    return errors;
  };

  const { handleSubmit, loading, error } = useForm(
    useCallback(
      async (data) => {
        setShippingAddress(data);
        await startOrder(cart._id, data);
        navigate('/checkout/payment');
      },
      [cart, setShippingAddress, startOrder, navigate]
    )
  );

  useEffect(() => {
    if (error) showToast({ type: 'error', message: error });
  }, [error, showToast]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    handleSubmit(fields);
  };

  // Ítems normalizados para el resumen, a partir del carrito (todavía no
  // existe el pedido en este paso).
  const summaryItems = useMemo(
    () =>
      products.map((line) => ({
        title: line.product?.title ?? '',
        thumbnail: line.product?.thumbnails?.[0] ?? line.product?.url ?? '',
        price: line.product?.price ?? 0,
        quantity: line.quantity,
      })),
    [products]
  );

  if (cartLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
      <CheckoutStepper currentStep={2} />

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <Card>
          <h1 className="h1-editorial text-2xl mb-1">Dirección de envío</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            La usamos solo para coordinar la entrega de tu pedido.
          </p>

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
        </Card>

        <OrderSummaryCard
          items={summaryItems}
          subtotal={cartTotal}
          shippingCost={0}
          total={cartTotal}
        />
      </div>
    </div>
  );
};

export default Shipping;
