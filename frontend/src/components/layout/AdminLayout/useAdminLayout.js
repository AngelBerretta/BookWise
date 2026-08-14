import { useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Estado del layout admin: crumb dinámico + nav mobile.
 * Al cambiar de sección admin, limpiamos cualquier crumb dinámico stale.
 * Ajustamos el estado durante el render (en vez de en un efecto) siguiendo
 * el patrón recomendado por React para resetear estado ante un cambio.
 */
const useAdminLayout = () => {
  const location = useLocation();
  const [extraCrumb, setExtraCrumb] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setExtraCrumb(null);
    setMobileNavOpen(false);
  }

  const toggleMobileNav = () => setMobileNavOpen((v) => !v);

  return { extraCrumb, setExtraCrumb, mobileNavOpen, toggleMobileNav };
};

export default useAdminLayout;