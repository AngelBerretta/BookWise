import { NavLink, Link } from 'react-router-dom';
import { NAV_ITEMS, navLinkCls, StoreIcon } from './navConfig';

/** Nav desplegable del admin en mobile */
const AdminMobileNav = ({ open }) => {
  if (!open) return null;

  return (
    <nav
      className="md:hidden flex flex-col gap-1 px-3 py-3"
      style={{ backgroundColor: 'var(--bw-primary, #041627)' }}
      aria-label="Navegación admin mobile"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} end={item.exact} className={navLinkCls}>
            <Icon />
            {item.label}
          </NavLink>
        );
      })}
      <Link
        to="/"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <StoreIcon />
        Volver a la tienda
      </Link>
    </nav>
  );
};

export default AdminMobileNav;