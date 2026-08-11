import Button from '../../ui/Button';
import TrashIcon from '../../ui/icons/TrashIcon';
import { CartIcon } from '../../ui/icons/NavIcons';
import { formatPrice } from '../../../utils/formatPrice';

const WishlistItemActions = ({
  price, outOfStock, addingToCart, removing, onAddToCart, onRemove,
}) => (
  <div className="mt-auto flex flex-col items-start gap-1.5">
    <span className="text-base font-bold text-[var(--text-h)] tabular-nums">
      {formatPrice(price, false)}
    </span>

    <div className="flex items-center gap-2">
      <Button
        variant={outOfStock ? 'secondary' : 'primary'}
        size="sm"
        disabled={outOfStock || removing}
        loading={addingToCart}
        onClick={onAddToCart}
      >
        {!addingToCart && <CartIcon className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">
          {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </span>
        <span className="sr-only sm:hidden">
          {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </span>
        <span aria-hidden="true" className="sm:hidden">
          {outOfStock ? 'Sin stock' : 'Agregar'}
        </span>
      </Button>

      <button
        onClick={onRemove}
        disabled={addingToCart || removing}
        aria-label="Quitar de favoritos"
        className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default WishlistItemActions;