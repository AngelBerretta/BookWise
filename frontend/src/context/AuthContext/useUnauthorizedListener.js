import { useEffect } from 'react';
import useToast from '../../hooks/useToast';

/**
 * Escucha el evento global disparado por el interceptor de axios (api.js)
 * ante cualquier 401 que NO sea un intento de login. Es el único punto
 * de entrada para "matar" la sesión desde fuera de React (network layer).
 * CartContext y WishlistContext no necesitan wiring adicional: ya derivan
 * su propio reset de `isAuthenticated`/`user`, así que se limpian solos
 * en cuanto este estado cambia.
 */
const useUnauthorizedListener = ({ setToken, setUser, setIsAuthenticated }) => {
  const { showToast } = useToast();

  useEffect(() => {
    const handleUnauthorized = () => {
      // api.js ya garantiza que este evento se dispare como máximo una vez
      // por sesión muerta (guarda síncrona sobre localStorage), así que acá
      // no hace falta lógica adicional de deduplicación.
      showToast({ type: 'warning', message: 'Tu sesión expiró. Iniciá sesión nuevamente.' });
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [showToast, setToken, setUser, setIsAuthenticated]);
};

export default useUnauthorizedListener;