import { NavLink } from 'react-router-dom';

export const LINKS = [
  { to: '/',         label: 'Inicio',    exact: true },
  { to: '/products', label: 'Productos' },
  { to: '/blog',     label: 'Blog' },
];

const linkBase = [
  'relative text-sm font-medium transition-colors duration-150',
  'text-[var(--text)] hover:text-[var(--text-h)]',
].join(' ');

const activeCls = 'text-[var(--accent)]';

/** Navegación principal — solo desktop. El menú mobile vive en MobileMenu.jsx */
const NavbarLinks = () => {
  const desktopLink = ({ isActive }) => [linkBase, isActive ? activeCls : ''].join(' ');

  return (
    <nav className="flex items-center gap-7" aria-label="Navegación principal">
      {LINKS.map(({ to, label, exact }) => (
        <NavLink key={to} to={to} end={exact} className={desktopLink}>
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
  );
};

export default NavbarLinks;