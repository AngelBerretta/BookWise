import { Link } from 'react-router-dom';
import { useState } from 'react';
import BookCoverPlaceholder from './BookCoverPlaceholder';

const ProductCardCover = ({
  productId, title, thumbnail, outOfStock,
  saved, togglingWishlist, onToggleWishlist,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative">
      <Link to={`/products/${productId}`} className="block">
        <div
          className="relative rounded-lg p-4 sm:p-6 flex justify-center items-center
                     aspect-[3/4] overflow-hidden"
          style={{ backgroundColor: 'var(--bg-container)' }}
        >
          {thumbnail && !imgError ? (
            <img
              src={thumbnail}
              alt={`Portada de ${title}`}
              onError={() => setImgError(true)}
              loading="lazy"
              decoding="async"
              className="w-4/5 h-auto object-cover rounded-md
                         group-hover:-translate-y-2 transition-transform duration-500"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            />
          ) : (
            <BookCoverPlaceholder title={title} />
          )}

          {outOfStock && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
              <span
                className="font-label text-xs font-medium px-3 py-1 rounded-sm"
                style={{ backgroundColor: 'rgba(251,249,244,0.90)', color: 'var(--bw-primary)' }}
              >
                Sin stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={onToggleWishlist}
        disabled={togglingWishlist}
        aria-label={saved ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={saved}
        className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full
                  transition-all duration-200 disabled:opacity-50"
        style={{
          backgroundColor: saved ? 'var(--accent)' : 'rgba(251,249,244,0.90)',
          color: saved ? '#ffffff' : 'var(--text)',
          boxShadow: saved ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
          transform: saved ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <span
          className="material-symbols-outlined transition-all duration-200"
          style={{
            fontSize: saved ? '20px' : '18px',
            fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {togglingWishlist ? 'hourglass_empty' : 'bookmark'}
        </span>
      </button>
    </div>
  );
};

export default ProductCardCover;