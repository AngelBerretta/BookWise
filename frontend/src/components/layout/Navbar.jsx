import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavbarLinks    from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
import MobileMenu     from './MobileMenu';
import SearchModal     from '../search/SearchModal';
import useCart        from '../../hooks/useCart';
import { CartIcon, SearchIcon } from '../ui/icons/NavIcons';
import LogoMark        from '../ui/icons/LogoMark';
import CountBadge      from '../ui/CountBadge';

const BookWiseLogo = () => (
  <Link to="/" className="group flex items-center gap-2.5 shrink-0" aria-label="BookWise — Inicio">
    <LogoMark size={34} className="shrink-0" />
    <span className="relative">
      <span
        className="text-xl sm:text-2xl font-bold tracking-tighter text-[var(--text-h)] transition-colors duration-200 group-hover:text-[var(--accent)]"
        style={{ fontFamily: 'var(--heading)' }}
      >
        BookWise
      </span>
      {/* Subrayado animado */}
      <span
        aria-hidden="true"
        className="absolute left-0 -bottom-0.5 h-[2px] w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-200 ease-out group-hover:scale-x-100"
      />
    </span>
  </Link>
);

const SearchButton = ({ onClick, className = '' }) => (
  <button
    onClick={onClick}
    aria-label="Buscar (Cmd+K)"
    title="Buscar (Cmd+K)"
    className={`relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors ${className}`}
  >
    <SearchIcon />
  </button>
);

const MobileCartButton = () => {
  const { itemCount } = useCart();
  return (
    <Link
      to="/cart"
      aria-label={`Carrito — ${itemCount} ${itemCount === 1 ? 'ítem' : 'ítems'}`}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors"
    >
      <CartIcon />
      <CountBadge count={itemCount} />
    </Link>
  );
};

const HamburgerButton = ({ open, onClick }) => (
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

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Cierra el drawer si el viewport pasa a desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Bloquea el scroll del body mientras el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Atajo global Cmd+K / Ctrl+K para abrir el buscador, desde cualquier lado
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[var(--navbar-h)] bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]"
      style={{ boxShadow: '0 1px 0 var(--border-subtle)' }}
      role="banner"
    >
      <div className="container h-full flex items-center justify-between gap-3 sm:gap-8">
        <BookWiseLogo />

        <div className="flex-1 hidden md:flex justify-center">
          <NavbarLinks />
        </div>

        {/* Desktop: búsqueda + menú de usuario completo */}
        <div className="hidden md:flex items-center gap-1">
          <SearchButton onClick={() => setSearchOpen(true)} />
          <NavbarUserMenu />
        </div>

        {/* Mobile: búsqueda + carrito + hamburguesa (el resto vive en el drawer) */}
        <div className="flex md:hidden items-center gap-1">
          <SearchButton onClick={() => setSearchOpen(true)} />
          <MobileCartButton />
          <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
};

export default Navbar;
