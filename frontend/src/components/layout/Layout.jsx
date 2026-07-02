import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout principal de la aplicación.
 * Envuelve todas las páginas con la Navbar fija y el Footer.
 */
const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="page-content flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
