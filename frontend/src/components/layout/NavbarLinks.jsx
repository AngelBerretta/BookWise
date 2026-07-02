import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/',         label: 'Inicio',    exact: true },
  { to: '/products', label: 'Productos' },
  { to: '/blog',     label: 'Blog' },
];

/* Clases compartidas */
const linkBase = [
  'relative text-sm font-medium transition-colors duration-150',
  'text-[var(--text)] hover:text-[var(--text-h)]',
].join(' ');

const activeCls = 'text-[var(--accent)]';

/**
 * Links de navegación principales.
 * En desktop: fila horizontal con indicador activo animado.
 * En mobile: menú desplegable tipo "drawer" desde arriba.
 *
 * @param {boolean} mobile - Si true renderiza el trigger hamburguesa
 */
const NavbarLinks = () => {
  const [open, setOpen] = useState(false);

  const desktopLink = ({ isActive }) =>
    [linkBase, isActive ? activeCls : ''].join(' ');

  const mobileLink = ({ isActive }) =>
    [
      'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
      isActive
        ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
        : 'text-[var(--text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-h)]',
    ].join(' ');

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav className="hidden md:flex items-center gap-7" aria-label="Navegación principal">
        {LINKS.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={desktopLink}
          >
            {({ isActive }) => (
              <>
                {label}
                {isActive && (
                  <span
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-[var(--accent)]"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Mobile: hamburguesa + drawer ── */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-[var(--accent-bg)] transition-colors"
        >
          <span
            className={[
              'block w-5 h-0.5 bg-[var(--text-h)] rounded-full transition-all duration-200',
              open ? 'rotate-45 translate-y-2' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block w-5 h-0.5 bg-[var(--text-h)] rounded-full transition-all duration-200',
              open ? 'opacity-0 scale-x-0' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block w-5 h-0.5 bg-[var(--text-h)] rounded-full transition-all duration-200',
              open ? '-rotate-45 -translate-y-2' : '',
            ].join(' ')}
          />
        </button>

        {/* Drawer */}
        {open && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <div
              className={[
                'fixed top-[var(--navbar-h)] left-0 right-0 z-50',
                'bg-[var(--bg)] border-b border-[var(--border)]',
                'px-4 py-3 shadow-[var(--shadow-lg)]',
              ].join(' ')}
            >
              <nav className="flex flex-col gap-1" aria-label="Menú mobile">
                {LINKS.map(({ to, label, exact }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={exact}
                    className={mobileLink}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NavbarLinks;
