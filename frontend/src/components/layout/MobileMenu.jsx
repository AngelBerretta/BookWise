import { useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminIcon, LogoutIcon } from '../ui/icons/NavIcons';
import { LINKS } from './NavbarLinks';

const MobileMenu = ({ open, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const panelRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Foco al primer link al abrir (accesibilidad)
  useEffect(() => {
    if (open) panelRef.current?.querySelector('a, button')?.focus();
  }, [open]);

  const mobileLink = ({ isActive }) => [
    'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
    isActive
      ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
      : 'text-[var(--text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-h)]',
  ].join(' ');

  const handleLogout = () => { logout(); onClose(); };

  return (
    <>
      {/* Overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden',
          'transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={[
          'fixed top-[var(--navbar-h)] left-0 right-0 z-50 md:hidden',
          'bg-[var(--bg)] border-b border-[var(--border)] shadow-[var(--shadow-lg)]',
          'max-h-[calc(100svh-var(--navbar-h))] overflow-y-auto overscroll-contain',
          'transition-all duration-300 ease-out',
          open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="px-4 py-4 flex flex-col gap-1">

          <nav className="flex flex-col gap-1" aria-label="Menú principal">
            {LINKS.map(({ to, label, exact }) => (
              <NavLink key={to} to={to} end={exact} className={mobileLink} onClick={onClose}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="my-3 h-px bg-[var(--border-subtle)]" aria-hidden="true" />

          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full text-center px-4 py-3 rounded-xl text-base font-medium text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="w-full text-center px-4 py-3 rounded-xl text-base font-medium bg-[var(--brand)] text-white hover:brightness-110 transition-all"
              >
                Registrarse
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {/* Info del usuario */}
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

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-[var(--text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-h)] transition-colors"
                >
                  <AdminIcon />
                  Panel de administración
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
              >
                <LogoutIcon />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;