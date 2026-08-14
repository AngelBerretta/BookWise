import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../../utils/constants';

const mobileLink = ({ isActive }) => [
  'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
  isActive
    ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
    : 'text-[var(--text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-h)]',
].join(' ');

const MobileMenuNav = ({ onNavigate }) => (
  <nav className="flex flex-col gap-1" aria-label="Menú principal">
    {NAV_LINKS.map(({ to, label, exact }) => (
      <NavLink key={to} to={to} end={exact} className={mobileLink} onClick={onNavigate}>
        {label}
      </NavLink>
    ))}
  </nav>
);

export default MobileMenuNav;