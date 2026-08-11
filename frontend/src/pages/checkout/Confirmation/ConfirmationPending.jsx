import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';

const ConfirmationPending = ({ exceededAttempts, checking, onCheckNow }) => (
  <Card className="text-center py-12">
    <Spinner size="lg" className="mx-auto mb-4" />
    <h1 className="h1-editorial text-2xl mb-2">Estamos confirmando tu pago…</h1>
    <p className="text-sm text-[var(--text-muted)] mb-6">
      Esto suele tardar solo unos segundos.
    </p>
    {exceededAttempts && (
      <Button onClick={onCheckNow} disabled={checking} loading={checking} className="mx-auto">
        Verificar de nuevo
      </Button>
    )}
  </Card>
);

export default ConfirmationPending;