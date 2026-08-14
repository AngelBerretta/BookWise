import { SearchIcon } from '../../ui/icons/NavIcons';

const NavbarSearchButton = ({ onClick, className = '' }) => (
  <button
    onClick={onClick}
    aria-label="Buscar (Cmd+K)"
    title="Buscar (Cmd+K)"
    className={`relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors ${className}`}
  >
    <SearchIcon />
  </button>
);

export default NavbarSearchButton;