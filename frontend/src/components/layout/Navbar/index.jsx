import NavbarLinks from '../NavbarLinks';
import NavbarUserMenu from '../NavbarUserMenu';
import MobileMenu from '../MobileMenu';
import SearchModal from '../../search/SearchModal';
import useNavbarBehavior from './useNavbarBehavior';
import BookWiseLogo from './BookWiseLogo';
import NavbarSearchButton from './NavbarSearchButton';
import NavbarMobileCartButton from './NavbarMobileCartButton';
import NavbarHamburgerButton from './NavbarHamburgerButton';

const Navbar = () => {
  const { mobileOpen, setMobileOpen, searchOpen, setSearchOpen } = useNavbarBehavior();

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

        <div className="hidden md:flex items-center gap-1">
          <NavbarSearchButton onClick={() => setSearchOpen(true)} />
          <NavbarUserMenu />
        </div>

        <div className="flex md:hidden items-center gap-1">
          <NavbarSearchButton onClick={() => setSearchOpen(true)} />
          <NavbarMobileCartButton />
          <NavbarHamburgerButton open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
};

export default Navbar;