import Breadcrumbs from '../Breadcrumbs';

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
       strokeLinecap="round" className="w-5 h-5">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

/** Topbar del admin: botón mobile + breadcrumbs + info de usuario */
const AdminTopbar = ({ extraCrumb, mobileNavOpen, onToggleMobileNav, user }) => (
  <header
    className="h-[var(--navbar-h)] flex items-center justify-between gap-4 px-4 sm:px-8 sticky top-0 z-10 bg-[var(--bg)]"
    style={{ borderBottom: '1px solid var(--border-subtle)' }}
  >
    <button
      onClick={onToggleMobileNav}
      className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text)] hover:bg-[var(--bg-subtle)] shrink-0"
      aria-label="Abrir menú admin"
      aria-expanded={mobileNavOpen}
    >
      <MenuIcon />
    </button>

    <Breadcrumbs extra={extraCrumb ? [extraCrumb] : []} />

    <div className="flex items-center gap-2 shrink-0">
      {user?.isDemo && (
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          Demo
        </span>
      )}
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold uppercase">
        {user?.username?.[0] ?? '?'}
      </span>
      <span className="hidden sm:block text-sm font-medium text-[var(--text-h)]">
        {user?.username}
      </span>
    </div>
  </header>
);

export default AdminTopbar;