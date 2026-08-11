import CheckoutStepper from '../../../components/checkout/CheckoutStepper';
import Spinner from '../../../components/ui/Spinner';
import useOrderPolling from './useOrderPolling';
import ConfirmationNotFound from './ConfirmationNotFound';
import ConfirmationPending from './ConfirmationPending';
import ConfirmationFailed from './ConfirmationFailed';
import ConfirmationSuccess from './ConfirmationSuccess';

/**
 * Paso 4 del checkout — confirmación del pedido.
 * Ver useOrderPolling para el detalle del polling contra el backend.
 */
const Confirmation = () => {
  const { status, currentOrder, checking, checkNow, exceededAttempts } = useOrderPolling();

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
      <CheckoutStepper currentStep={4} completed={status === 'paid'} />

      {status === 'loading' && (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      )}

      {status === 'not_found' && <ConfirmationNotFound />}

      {(status === 'pending' || (status === 'paid' && !currentOrder)) && (
        <ConfirmationPending
          exceededAttempts={exceededAttempts}
          checking={checking}
          onCheckNow={checkNow}
        />
      )}

      {status === 'failed' && <ConfirmationFailed currentOrder={currentOrder} />}

      {status === 'paid' && currentOrder && <ConfirmationSuccess order={currentOrder} />}
    </div>
  );
};

export default Confirmation;