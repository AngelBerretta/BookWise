import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import { formatPrice } from '../../../utils/formatPrice';

const CartMenuFooter = ({ remaining, total, onNavigate }) => (
  <div className="px-4 py-4 border-t border-[var(--border)] flex flex-col gap-3">
    {remaining > 0 && (
      <p className="text-xs text-center text-[var(--text)] opacity-60">
        +{remaining} {remaining === 1 ? 'producto más' : 'productos más'}
      </p>
    )}
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-[var(--text)]">Total</span>
      <span className="text-base font-bold text-[var(--text-h)] tabular-nums">
        {formatPrice(total, false)}
      </span>
    </div>
    <Link to="/cart" onClick={onNavigate}>
      <Button variant="primary" size="md" className="w-full">
        Ver carrito
      </Button>
    </Link>
  </div>
);

export default CartMenuFooter;