import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from './Breadcrumbs';

/* ─── Íconos ─────────────────────────────────────────────── */
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const PostIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const StoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NAV_ITEMS = [
  { to: '/admin',          label: 'Dashboard', icon: DashboardIcon, exact: true },
  { to: '/admin/products', label: 'Productos', icon: BookIcon },
  { to: '/admin/blog',     label: 'Blog',      icon: PostIcon },
];

const navLinkCls = ({ isActive }) =>
  [
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
    isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
  ].join(' ');

/**
 * Layout dedicado del panel de administración.
 * Reemplaza al Layout público en las rutas /admin/* — sidebar navy
 * (identidad visual distinta a propósito) + topbar con breadcrumbs.
 *
 * Expone `setExtraCrumb` vía Outlet context para que páginas hijas
 * (ej: AdminProducts editando un producto) puedan agregar un crumb
 * dinámico sin necesidad de que exista una ruta propia para ese estado.
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [extraCrumb, setExtraCrumb] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Al cambiar de sección admin, limpiamos cualquier crumb dinámico stale
  useEffect(() => {
    setExtraCrumb(null);
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">

      {/* ── Sidebar desktop ── */}
      <aside
        className="hidden md:flex md:flex-col w-64 shrink-0 sticky top-0 h-screen"
        style={{ backgroundColor: 'var(--bw-primary, #041627)' }}
      >
        <div className="h-[var(--navbar-h)] flex items-center gap-2 px-6 shrink-0"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span
            className="text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: 'var(--heading)' }}
          >
            BookWise
          </span>
          <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white">
            Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-6 flex flex-col gap-1" aria-label="Navegación admin">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink key={to} to={to} end={exact} className={navLinkCls}>
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <StoreIcon />
            Volver a la tienda
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors text-left"
          >
            <LogoutIcon />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Columna principal ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header
          className="h-[var(--navbar-h)] flex items-center justify-between gap-4 px-4 sm:px-8 sticky top-0 z-10 bg-[var(--bg)]"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          {/* Botón menú mobile */}
          <button
            onClick={() => setMobileNavOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:bg-[var(--bg-subtle)] shrink-0"
            aria-label="Abrir menú admin"
            aria-expanded={mobileNavOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
                 strokeLinecap="round" className="w-5 h-5">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>

          <Breadcrumbs extra={extraCrumb ? [extraCrumb] : []} />

          <div className="flex items-center gap-2 shrink-0">
            {user?.isDemo && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                Demo
              </span>
            )}
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold uppercase">
              {user?.username?.[0] ?? '?'}
            </span>
            <span className="hidden sm:block text-sm font-medium text-[var(--text-h)]">
              {user?.username}
            </span>
          </div>
        </header>

        {/* Nav mobile desplegable */}
        {mobileNavOpen && (
          <nav
            className="md:hidden flex flex-col gap-1 px-3 py-3"
            style={{ backgroundColor: 'var(--bw-primary, #041627)' }}
            aria-label="Navegación admin mobile"
          >
            {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
              <NavLink key={to} to={to} end={exact} className={navLinkCls}>
                <Icon />
                {label}
              </NavLink>
            ))}
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <StoreIcon />
              Volver a la tienda
            </Link>
          </nav>
        )}

        <main className="flex-1 p-4 sm:p-8">
          <Outlet context={{ setExtraCrumb }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;