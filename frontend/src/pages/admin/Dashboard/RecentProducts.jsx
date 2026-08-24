import { Link } from 'react-router-dom';
import { RecentProductRow, RecentProductRowSkeleton } from './RecentProductRow';

const RecentProducts = ({ loading, products }) => {
  if (!loading && products.length === 0) return null;

  return (
    <>
      <div className="fade-up flex items-center gap-3 mb-3" style={{ animationDelay: '170ms' }}>
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text)]">
          Últimos productos agregados
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
        <Link
          to="/admin/products"
          className="text-xs font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors shrink-0"
        >
          Ver todos
        </Link>
      </div>
      <div
        className="fade-up rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-1 mb-10 divide-y divide-[var(--border)]"
        style={{ animationDelay: '190ms' }}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <RecentProductRowSkeleton key={i} />)
          : products.map((p) => <RecentProductRow key={p._id} product={p} />)}
      </div>
    </>
  );
};

export default RecentProducts;