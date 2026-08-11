import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ConfirmationNotFound = () => (
  <Card className="text-center py-12">
    <h1 className="h1-editorial text-2xl mb-2">No encontramos ese pedido</h1>
    <p className="text-sm text-[var(--text-muted)] mb-6">
      Puede que el enlace haya expirado o que el pedido pertenezca a otra cuenta.
    </p>
    <Link to="/products">
      <Button>Ir al catálogo</Button>
    </Link>
  </Card>
);

export default ConfirmationNotFound;