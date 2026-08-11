import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatPrice';

const WishlistMenuItem = ({ product, onClick }) => {
  const thumbnail = product?.thumbnails?.[0] || product?.url;
  return (
    <li className="flex gap-3 px-4 py-3">
      <Link
        to={`/products/${product?._id}`}
        onClick={onClick}
        className="shrink-0 w-12 h-16 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Portada de ${product.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-symbols-outlined text-base" style={{ color: 'var(--border)' }}>
            menu_book
          </span>
        )}
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <Link
          to={`/products/${product?._id}`}
          onClick={onClick}
          className="text-sm font-medium text-[var(--text-h)] hover:text-[var(--accent)] transition-colors line-clamp-1"
        >
          {product?.title}
        </Link>
        <span className="text-xs text-[var(--text)] opacity-70">
          {formatPrice(product?.price, false)}
        </span>
      </div>
    </li>
  );
};

export default WishlistMenuItem;