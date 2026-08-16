import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatPrice';

const SearchModalProductResults = ({ products, onNavigate }) => (
  <div className="py-2">
    <p className="px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text)] opacity-60">
      Libros
    </p>
    {products.map((product) => {
      const thumbnail = product?.thumbnails?.[0] || product?.url;
      return (
        <Link
          key={product._id}
          to={`/products/${product._id}`}
          onClick={onNavigate}
          className="flex items-center gap-3 px-5 py-2.5 hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <span className="shrink-0 w-9 h-12 rounded-md overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center">
            {thumbnail ? (
              <img src={thumbnail} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-sm" style={{ color: 'var(--border)' }}>
                menu_book
              </span>
            )}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-[var(--text-h)] line-clamp-1">
              {product.title}
            </span>
            <span className="block text-xs text-[var(--text)] opacity-70">
              {formatPrice(product.price, false)}
            </span>
          </span>
        </Link>
      );
    })}
  </div>
);

export default SearchModalProductResults;