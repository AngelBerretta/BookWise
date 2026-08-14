import { Link } from 'react-router-dom';
import { AdminIcon, LogoutIcon, WishlistIcon } from '../../ui/icons/NavIcons';

const MobileMenuUser = ({ user, wishlistCount, onNavigate, onLogout }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-subtle)]">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-sm font-semibold uppercase shrink-0" aria-hidden="true">
        {user?.username?.[0] ?? '?'}
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-[var(--text-h)] truncate">
          {user?.username}
        </span>
        {user?.isDemo && (
          <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 mt-0.5">
            Demo
          </span>
        )}
      </div>
    </div>

    <Link
      to="/wishlist"
      onClick={onNavigate}
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-[var(--text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-h)] transition-colors"
    >
      <WishlistIcon />
      Favoritos
      {wishlistCount > 0 && (
        <span className="ml-auto text-xs font-semibold text-[var(--accent)]">
          {wishlistCount}
        </span>
      )}
    </Link>

    {user?.role === 'admin' && (
      <Link
        to="/admin"
        onClick={onNavigate}
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-[var(--text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-h)] transition-colors"
      >
        <AdminIcon />
        Panel de administración
      </Link>
    )}

    <button
      onClick={onLogout}
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
    >
      <LogoutIcon />
      Cerrar sesión
    </button>
  </div>
);

export default MobileMenuUser;