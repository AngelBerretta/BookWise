import { NavLink, Link } from 'react-router-dom';
import { NAV_ITEMS, navLinkCls, StoreIcon, LogoutIcon } from './navConfig';

/** Sidebar desktop del panel admin — identidad visual navy, distinta a propósito de la tienda */
const AdminSidebar = ({ onLogout }) => (
  <aside
    className="hidden md:flex md:flex-col w-64 shrink-0 sticky top-0 h-screen"
    style={{ backgroundColor: 'var(--bw-primary, #041627)' }}
  >
    <div className="h-[var(--navbar-h)] flex items-center gap-2 px-6 shrink-0"
         style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--heading)' }}>
        BookWise
      </span>
      <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white">
        Admin
      </span>
    </div>

    <nav className="flex-1 px-3 py-6 flex flex-col gap-1" aria-label="Navegación admin">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} end={item.exact} className={navLinkCls}>
            <Icon />
            {item.label}
          </NavLink>
        );
      })}
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
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors text-left"
      >
        <LogoutIcon />
        Cerrar sesión
      </button>
    </div>
  </aside>
);

export default AdminSidebar;