import { Link } from 'react-router-dom';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import Button from '../../components/ui/Button';

const CartPageHeader = ({ itemCount, onClearClick }) => (
  <>
    <Link
      to="/products"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text)] hover:text-[var(--text-h)] transition-colors mb-6 w-fit"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
      </svg>
      Seguir comprando
    </Link>

    <CheckoutStepper currentStep={1} />

    <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 className="h1-editorial">Mi carrito</h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearClick}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path
            fillRule="evenodd"
            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z"
            clipRule="evenodd"
          />
        </svg>
        Vaciar carrito
      </Button>
    </div>
  </>
);

export default CartPageHeader;