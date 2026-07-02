import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/* ─── Íconos SVG inline ─────────────────────── */
const CartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const AdminIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2Z" />
    <path d="M12 14c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
    <circle cx="18" cy="8" r="3" />
    <path d="M18 5v1M18 10v1M15.27 6.5l.87.5M20.87 9l-.87-.5M15.27 9.5l.87-.5M20.87 7l-.87.5" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ─── Componente principal ──────────────────── */
const NavbarUserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  /* Usuario NO autenticado */
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className={[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
            'text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--accent-bg)]',
          ].join(' ')}
        >
          Iniciar sesión
        </Link>

        <Link
          to="/register"
          className={[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            'bg-[var(--accent)] text-white',
            'hover:brightness-110 active:brightness-95',
          ].join(' ')}
        >
          Registrarse
        </Link>
      </div>
    );
  }

  /* Usuario autenticado */
  return (
    <div className="flex items-center gap-1 md:gap-2">

      {/* Link panel admin — solo si es admin */}
      {user?.role === 'admin' && (
        <Link
          to="/admin"
          title="Panel de administración"
          className={[
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium',
            'text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]',
            'transition-colors duration-150',
          ].join(' ')}
        >
          <AdminIcon />
          <span className="hidden lg:block">Admin</span>
        </Link>
      )}

      {/* Carrito con badge */}
      <Link
        to="/cart"
        aria-label={`Carrito — ${itemCount} ${itemCount === 1 ? 'ítem' : 'ítems'}`}
        className={[
          'relative flex items-center justify-center w-9 h-9 rounded-lg',
          'text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]',
          'transition-colors duration-150',
        ].join(' ')}
      >
        <CartIcon />

        {/* Badge de contador */}
        {itemCount > 0 && (
          <span
            aria-hidden="true"
            className={[
              'absolute -top-0.5 -right-0.5',
              'min-w-[18px] h-[18px] px-1',
              'flex items-center justify-center',
              'text-[10px] font-bold text-white',
              'bg-[var(--accent)] rounded-full',
              'leading-none',
            ].join(' ')}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Link>

      {/* Divider */}
      <div className="hidden md:block w-px h-5 bg-[var(--border)] mx-1" aria-hidden="true" />

      {/* Avatar + nombre */}
      <div
        className={[
          'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg',
          'bg-[var(--bg-subtle)] border border-[var(--border)]',
        ].join(' ')}
      >
        {/* Avatar inicial */}
        <span
          className={[
            'flex items-center justify-center w-6 h-6 rounded-full',
            'bg-[var(--accent-bg)] text-[var(--accent)]',
            'text-xs font-semibold uppercase',
          ].join(' ')}
          aria-hidden="true"
        >
          {user?.username?.[0] ?? '?'}
        </span>

        <span className="text-sm font-medium text-[var(--text-h)] max-w-[120px] truncate">
          {user?.username}
        </span>
      </div>

      {/* Botón logout */}
      <button
        onClick={logout}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className={[
          'flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm',
          'text-[var(--text)] hover:text-red-500 hover:bg-red-50',
          'dark:hover:bg-red-950/40',
          'transition-colors duration-150',
        ].join(' ')}
      >
        <LogoutIcon />
        <span className="hidden lg:block text-sm">Salir</span>
      </button>
    </div>
  );
};

export default NavbarUserMenu;
