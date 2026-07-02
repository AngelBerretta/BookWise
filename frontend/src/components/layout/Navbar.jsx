import { Link, NavLink } from 'react-router-dom';
import NavbarLinks    from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';

const BookWiseLogo = () => (
  <Link
    to="/"
    className="group"
    aria-label="BookWise — Inicio"
  >
    <span
      className="text-2xl font-bold tracking-tighter text-[var(--text-h)] group-hover:opacity-70 transition-opacity"
      style={{ fontFamily: 'var(--heading)' }}
    >
      BookWise
    </span>
  </Link>
);

const Navbar = () => (
  <header
    className="fixed top-0 left-0 right-0 z-50 h-[var(--navbar-h)] bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]"
    style={{ boxShadow: '0 1px 0 var(--border-subtle)' }}
    role="banner"
  >
    <div className="container h-full flex items-center justify-between gap-8">
      <BookWiseLogo />

      <div className="flex-1 flex justify-center">
        <NavbarLinks />
      </div>

      <NavbarUserMenu />
    </div>
  </header>
);

export default Navbar;
