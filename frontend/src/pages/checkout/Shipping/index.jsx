import CheckoutStepper from '../../../components/checkout/CheckoutStepper';
import OrderSummaryCard from '../../../components/checkout/OrderSummaryCard';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import useShippingForm from './useShippingForm';
import ShippingAddressForm from './ShippingAddressForm';

/**
 * Paso 2 del checkout — dirección de envío.
 * Al confirmar, crea el pedido en el backend (snapshot del carrito + esta
 * dirección) y avanza a /checkout/payment.
 */
const Shipping = () => {
  const {
    fields, fieldErrors, onChange, onSubmit, loading,
    cartLoading, cartTotal, summaryItems,
  } = useShippingForm();

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

          <ShippingAddressForm
            fields={fields}
            fieldErrors={fieldErrors}
            onChange={onChange}
            onSubmit={onSubmit}
            loading={loading}
          />
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