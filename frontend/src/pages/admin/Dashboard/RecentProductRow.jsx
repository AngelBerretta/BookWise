import { Link } from 'react-router-dom';

export const RecentProductRow = ({ product }) => {
  const fmt = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) : '—';

  return (
    <Link
      to="/admin/products"
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 -mx-3 hover:bg-[var(--bg-subtle)] transition-colors duration-150 group"
    >
      <div className="w-9 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-[var(--code-bg)] border border-[var(--border)]">
        {product.thumbnails?.[0] ? (
          <img
            src={product.thumbnails[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[var(--border)]">
            <rect x="2" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" />
            <rect x="5" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" fill="var(--bg-subtle)" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--text-h)] truncate group-hover:text-[var(--accent)] transition-colors">
          {product.title}
        </p>
        <p className="text-xs text-[var(--text)] mt-0.5">
          {fmt(product.price)} · agregado el {fmtDate(product.createdAt)}
        </p>
      </div>
    </Link>
  );
};

export const RecentProductRowSkeleton = () => (
  <div className="flex items-center gap-3 px-3 py-2.5 -mx-3 animate-pulse" aria-hidden="true">
    <div
      className="w-9 h-12 rounded-lg shrink-0"
      style={{ backgroundColor: 'var(--bg-container)' }}
    />
    <div className="min-w-0 flex-1 flex flex-col gap-2">
      <div className="h-3.5 w-2/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-3 w-1/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>
  </div>
);