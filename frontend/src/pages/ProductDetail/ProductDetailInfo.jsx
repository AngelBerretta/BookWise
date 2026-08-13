import Button from '../../components/ui/Button';
import { CartIcon } from '../../components/ui/icons/NavIcons';
import { formatPrice } from '../../utils/formatPrice';
import ProductDetailHeader from './ProductDetailHeader';
import ProductDetailQuantitySelector from './ProductDetailQuantitySelector';
import ProductDetailWishlistButton from './ProductDetailWishlistButton';

const ProductDetailInfo = ({
  title, author, category, price, stock, outOfStock,
  quantity, setQuantity, maxQty,
  saved, savingWish, onToggleWishlist,
  adding, onAddToCart,
}) => (
  <>
    <ProductDetailHeader title={title} author={author} category={category} />

    <div
      className="rounded-xl p-5 sm:p-8 mb-8 sm:mb-10 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-lowest)',
        border: '1px solid rgba(196,198,205,0.15)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top right, color-mix(in srgb, var(--bg-subtle) 50%, transparent), transparent)',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="font-headline text-3xl" style={{ color: 'var(--text-h)' }}>
            {formatPrice(price, false)}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
            {outOfStock
              ? 'Sin stock disponible'
              : `${stock} ${stock === 1 ? 'unidad disponible' : 'unidades disponibles'}`}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {!outOfStock && (
            <ProductDetailQuantitySelector quantity={quantity} setQuantity={setQuantity} maxQty={maxQty} />
          )}

          <ProductDetailWishlistButton saved={saved} savingWish={savingWish} onToggle={onToggleWishlist} />

          {!outOfStock ? (
            <Button
              variant="primary"
              size="lg"
              loading={adding}
              onClick={onAddToCart}
              className="flex-1 justify-center min-w-[200px]"
            >
              {!adding && <CartIcon className="w-5 h-5" />}
              {adding ? 'Agregando…' : 'Agregar al carrito'}
            </Button>
          ) : (
            <Button variant="secondary" size="lg" disabled className="flex-1 justify-center min-w-[200px]">
              Sin stock
            </Button>
          )}
        </div>
      </div>
    </div>
  </>
);

export default ProductDetailInfo;