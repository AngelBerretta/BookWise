import { Link, useLocation } from 'react-router-dom';

/* Config declarativa de rutas admin — agregar acá al sumar secciones nuevas */
const ADMIN_ROUTES = [
  { path: '/admin',          label: 'Dashboard' },
  { path: '/admin/products', label: 'Productos' },
  { path: '/admin/blog',     label: 'Blog' },
];

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-[var(--border)] shrink-0">
    <path fillRule="evenodd"
      d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd" />
  </svg>
);

/**
 * Breadcrumbs del panel admin.
 * Se arma automáticamente según la ruta actual (config ADMIN_ROUTES).
 *
 * @param {{label: string}[]} extra - crumbs adicionales para estados sin
 *   ruta propia (ej: "Editar 'X'" cuando la edición ocurre en un modal).
 */
const Breadcrumbs = ({ extra = [] }) => {
  const { pathname } = useLocation();

  const isDashboard = pathname === '/admin';
  const matched = ADMIN_ROUTES.find((r) => r.path === pathname);

  const crumbs = [
    { label: 'Dashboard', to: '/admin' },
    ...(!isDashboard && matched ? [{ label: matched.label, to: matched.path }] : []),
    ...extra.map((c) => ({ label: c.label, to: null })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0 overflow-hidden">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-2 min-w-0">
            {i > 0 && <ChevronIcon />}
            {crumb.to && !isLast ? (
              <Link
                to={crumb.to}
                className="text-[var(--text)] hover:text-[var(--text-h)] transition-colors truncate"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={[
                  'truncate',
                  isLast ? 'text-[var(--text-h)] font-medium' : 'text-[var(--text)]',
                ].join(' ')}
              >
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;