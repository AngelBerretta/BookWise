import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ConfirmationFailed = ({ currentOrder }) => (
  <Card className="text-center py-12">
    <div className="w-14 h-14 rounded-full bg-[var(--error-bg)] flex items-center justify-center mx-auto mb-4">
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[var(--error-text)]">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
    <h1 className="h1-editorial text-2xl mb-2">El pago no se pudo completar</h1>
    <p className="text-sm text-[var(--text-muted)] mb-6">
      Tu pedido{' '}
      {currentOrder?.orderNumber && <span className="font-mono">{currentOrder.orderNumber}</span>}{' '}
      no fue cobrado. Podés volver a intentarlo con otra tarjeta.
    </p>
    <Link to="/checkout/payment">
      <Button>Reintentar el pago</Button>
    </Link>
  </Card>
);

export default ConfirmationFailed;