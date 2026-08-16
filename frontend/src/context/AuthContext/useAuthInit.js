import { useEffect } from 'react';
import { getMe } from '../../services/authService';
import { clearSession } from './authStorage';

/** Verifica el token contra el servidor al montar. */
const useAuthInit = ({ setUser, setToken, setIsAuthenticated, setLoading }) => {
  useEffect(() => {
    const initAuth = async () => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMe();
        // Actualiza con los datos frescos del servidor
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
      } catch {
        // Token inválido o expirado — limpiar todo
        clearSession();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAuthInit;