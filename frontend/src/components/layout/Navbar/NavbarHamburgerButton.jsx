const NavbarHamburgerButton = ({ open, onClick }) => (
  <button
    onClick={onClick}
    aria-expanded={open}
    aria-controls="mobile-menu"
    aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
    className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-[var(--accent-bg)] transition-colors shrink-0"
  >
    <span className={`block w-5 h-0.5 bg-[var(--text-h)] rounded-full transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
    <span className={`block w-5 h-0.5 bg-[var(--text-h)] rounded-full transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
    <span className={`block w-5 h-0.5 bg-[var(--text-h)] rounded-full transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
  </button>
);

export default NavbarHamburgerButton;