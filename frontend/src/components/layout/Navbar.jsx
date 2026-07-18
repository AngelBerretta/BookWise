import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavbarLinks    from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
import MobileMenu     from './MobileMenu';
import useCart        from '../../hooks/useCart';
import { CartIcon }   from '../ui/icons/NavIcons';
import CartBadge      from '../ui/CartBadge';

const BookWiseLogo = () => (
  <Link to="/" className="group shrink-0" aria-label="BookWise — Inicio">
    <span
      className="text-xl sm:text-2xl font-bold tracking-tighter text-[var(--text-h)] group-hover:opacity-70 transition-opacity"
      style={{ fontFamily: 'var(--heading)' }}
    >
      BookWise
    </span>
  </Link>
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
      <CartBadge count={itemCount} />
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

        {/* Desktop: menú de usuario completo */}
        <div className="hidden md:flex items-center">
          <NavbarUserMenu />
        </div>

        {/* Mobile: acceso rápido a carrito + hamburguesa (todo lo demás vive en el drawer) */}
        <div className="flex md:hidden items-center gap-1">
          <MobileCartButton />
          <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
};

export default Navbar;
