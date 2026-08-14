import useAuth from '../../../hooks/useAuth';
import useWishlist from '../../../hooks/useWishlist';
import useMobileMenu from './useMobileMenu';
import MobileMenuNav from './MobileMenuNav';
import MobileMenuGuest from './MobileMenuGuest';
import MobileMenuUser from './MobileMenuUser';

const MobileMenu = ({ open, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();
  const panelRef = useMobileMenu(open, onClose);

  const handleLogout = () => { logout(); onClose(); };

  return (
    <>
      {/* Overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden',
          'transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={[
          'fixed top-[var(--navbar-h)] left-0 right-0 z-50 md:hidden',
          'bg-[var(--bg)] border-b border-[var(--border)] shadow-[var(--shadow-lg)]',
          'max-h-[calc(100svh-var(--navbar-h))] overflow-y-auto overscroll-contain',
          'transition-all duration-300 ease-out',
          open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          <MobileMenuNav onNavigate={onClose} />

          <div className="my-3 h-px bg-[var(--border-subtle)]" aria-hidden="true" />

          {!isAuthenticated ? (
            <MobileMenuGuest onNavigate={onClose} />
          ) : (
            <MobileMenuUser
              user={user}
              wishlistCount={wishlist.length}
              onNavigate={onClose}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;