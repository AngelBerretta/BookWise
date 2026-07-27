import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Rutas de "funnel" (conversión) donde el footer compite con el CTA
// y además la barra fija mobile lo taparía parcialmente al hacer scroll.
const HIDE_FOOTER_PATHS = ['/cart'];

/**
 * Layout principal de la aplicación.
 * Envuelve todas las páginas con la Navbar fija y el Footer.
 */
const Layout = () => {
  const { pathname } = useLocation();
  const hideFooter = HIDE_FOOTER_PATHS.includes(pathname);

  return (
    <>
      <Navbar />
      <main
        className="page-content flex-1 flex flex-col"
        style={hideFooter ? { flex: '0 1 auto', minHeight: 0 } : undefined}
      >
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;
