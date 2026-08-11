import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { formatPrice } from '../../../utils/formatPrice';
import { CartIcon } from '../../ui/icons/NavIcons';
import useProductCardActions from './useProductCardActions';
import ProductCardCover from './ProductCardCover';

const ProductCard = ({ product }) => {
  const {
    saved,
    adding,
    togglingWishlist,
    handleAddToCart,
    handleToggleWishlist,
  } = useProductCardActions(product);

  const { _id, title, author, price, category, thumbnails, stock } = product;
  const thumbnail = thumbnails?.[0];
  const outOfStock = stock === 0;
  const lowStock = !outOfStock && stock > 0 && stock <= 3;
  const formattedPrice = formatPrice(price, false);

  return (
    <article className="group flex flex-col gap-4 h-full min-w-0">
      <ProductCardCover
        productId={_id}
        title={title}
        thumbnail={thumbnail}
        outOfStock={outOfStock}
        saved={saved}
        togglingWishlist={togglingWishlist}
        onToggleWishlist={handleToggleWishlist}
      />

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 h-5">
          {category && <Badge category={category} />}
          {lowStock && (
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 shrink-0">
              ¡Últimas {stock}!
            </span>
          )}
        </div>

        <Link to={`/products/${_id}`}>
          <h3
            className="font-headline text-xl leading-tight transition-colors duration-200 line-clamp-2 hover:text-[var(--secondary)] min-h-[3.125rem]"
            style={{ color: 'var(--text-h)', fontFamily: "'Newsreader', Georgia, serif" }}
          >
            {title}
          </h3>
        </Link>

        <p className="font-body text-sm truncate min-h-[1.25rem]" style={{ color: 'var(--text)' }}>
          {author ? `por ${author}` : '\u00A0'}
        </p>

        <div className="flex justify-between items-center mt-auto pt-2 gap-2">
          <span className="font-body font-medium" style={{ color: 'var(--text-h)' }}>
            {formattedPrice}
          </span>

          <Button
            variant={outOfStock ? 'secondary' : 'primary'}
            size="sm"
            disabled={outOfStock}
            loading={adding}
            onClick={handleAddToCart}
          >
            {!adding && <CartIcon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {outOfStock ? 'Sin stock' : 'Agregar'}
            </span>
            <span className="sr-only sm:hidden">
              {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
            </span>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;