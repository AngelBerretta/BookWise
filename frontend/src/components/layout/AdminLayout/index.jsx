import { Outlet } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAdminLayout from './useAdminLayout';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminMobileNav from './AdminMobileNav';

/**
 * Layout dedicado del panel de administración.
 * Reemplaza al Layout público en las rutas /admin/* — sidebar navy
 * (identidad visual distinta a propósito) + topbar con breadcrumbs.
 *
 * Expone `setExtraCrumb` vía Outlet context para que páginas hijas
 * (ej: AdminProducts editando un producto) puedan agregar un crumb
 * dinámico sin necesidad de que exista una ruta propia para ese estado.
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { extraCrumb, setExtraCrumb, mobileNavOpen, toggleMobileNav } = useAdminLayout();

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          extraCrumb={extraCrumb}
          mobileNavOpen={mobileNavOpen}
          onToggleMobileNav={toggleMobileNav}
          user={user}
        />

        <AdminMobileNav open={mobileNavOpen} />

        <main className="flex-1 p-4 sm:p-8">
          <Outlet context={{ setExtraCrumb }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;