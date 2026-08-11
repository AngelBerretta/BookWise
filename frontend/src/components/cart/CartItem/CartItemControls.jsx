import Button from '../../ui/Button';
import { WishlistIcon } from '../../ui/icons/NavIcons';
import { formatPrice } from '../../../utils/formatPrice';

const CartItemControls = ({
  quantity, price, maxQty, quantityPending, qtyControlsDisabled, isDisabled,
  onQuantityChange, saved, savingForLater, onSaveForLater, removing, onRemove,
}) => (
  <div className="flex items-center gap-3 flex-wrap">
    <div className={`flex items-center rounded-lg border border-[var(--border)] overflow-hidden transition-opacity ${qtyControlsDisabled ? 'opacity-50' : ''}`}>
      <button
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={qtyControlsDisabled || quantity <= 1}
        className="px-2.5 py-1.5 text-[var(--text)] hover:bg-[var(--code-bg)] disabled:cursor-not-allowed transition-colors text-base leading-none"
        aria-label="Reducir cantidad"
      >
        −
      </button>
      <span className="relative px-3 py-1.5 text-sm font-semibold text-[var(--text-h)] border-x border-[var(--border)] min-w-[2.5rem] text-center tabular-nums">
        {quantity}
        {quantityPending && (
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"
            aria-hidden="true"
          />
        )}
      </span>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={qtyControlsDisabled || quantity >= maxQty}
        className="px-2.5 py-1.5 text-[var(--text)] hover:bg-[var(--code-bg)] disabled:cursor-not-allowed transition-colors text-base leading-none"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
    <span className="sr-only" role="status">
      {quantityPending ? `Actualizando cantidad a ${quantity}` : ''}
    </span>

    <Button
      variant="ghost"
      size="sm"
      loading={savingForLater}
      disabled={isDisabled}
      onClick={onSaveForLater}
      className="px-2"
      aria-label="Guardar para después"
    >
      <WishlistIcon filled={saved} className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Guardar para después</span>
    </Button>

    <Button
      variant="ghost"
      size="sm"
      loading={removing}
      disabled={isDisabled}
      onClick={onRemove}
      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2"
      aria-label="Eliminar del carrito"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path
          fillRule="evenodd"
          d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="hidden sm:inline">Eliminar</span>
    </Button>

    <span className="ml-auto text-sm font-bold text-[var(--text-h)] tabular-nums">
      {formatPrice(price * quantity, false)}
    </span>
  </div>
);

export default CartItemControls;