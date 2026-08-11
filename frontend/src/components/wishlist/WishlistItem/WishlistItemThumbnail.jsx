import { Link } from 'react-router-dom';

const WishlistItemThumbnail = ({ productId, title, thumbnail }) => (
  <Link
    to={`/products/${productId}`}
    className="shrink-0 w-24 h-32 sm:w-28 sm:h-40 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center"
  >
    {thumbnail ? (
      <img
        src={thumbnail}
        alt={`Portada de ${title}`}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    ) : (
      <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 text-[var(--border)]">
        <rect x="4" y="3" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="3" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-subtle)" />
        <line x1="13" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )}
  </Link>
);

export default WishlistItemThumbnail;