import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { AdminIcon, LogoutIcon } from '../ui/icons/NavIcons';
import CartMenu from '../cart/CartMenu';
import WishlistMenu from '../wishlist/WishlistMenu';

/** Menú de usuario — se renderiza solo en desktop (ver Navbar.jsx) */
const NavbarUserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--accent-bg)]"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 bg-[var(--brand)] text-white hover:brightness-110 active:brightness-95"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user?.role === 'admin' && (
        <Link
          to="/admin"
          title="Panel de administración"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors duration-150"
        >
          <AdminIcon />
          <span className="hidden lg:block">Admin</span>
        </Link>
      )}

      <WishlistMenu />
      <CartMenu />

      <div className="w-px h-5 bg-[var(--border)] mx-1" aria-hidden="true" />

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)]">
        {user?.isDemo && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            Demo
          </span>
        )}
        <span
          className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold uppercase"
          aria-hidden="true"
        >
          {user?.username?.[0] ?? '?'}
        </span>
        <span className="text-sm font-medium text-[var(--text-h)] max-w-[120px] truncate">
          {user?.username}
        </span>
      </div>

      <button
        onClick={logout}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm text-[var(--text)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors duration-150"
      >
        <LogoutIcon />
        <span className="hidden lg:block text-sm">Salir</span>
      </button>
    </div>
  );
};

export default NavbarUserMenu;