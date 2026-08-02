import { createContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/authService';
import * as authService from '../services/authService';
import { resetSessionGuard } from '../services/api';
import useToast from '../hooks/useToast';

const AuthContext = createContext(null);

/* Lee el usuario guardado en localStorage sin hacer ninguna petición */
const getUserFromStorage = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  const { showToast } = useToast();

  /*
   * Inicializamos el estado de forma sincrónica desde localStorage.
   * Esto evita que ProtectedRoute redirija mientras getMe() aún no respondió.
   */
  const [user, setUser]                     = useState(() => (storedToken ? getUserFromStorage() : null));
  const [token, setToken]                   = useState(() => storedToken);
  const [loading, setLoading]               = useState(!!storedToken); // solo carga si hay token
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!storedToken && !!getUserFromStorage());

  /*
  * Escucha el evento global disparado por el interceptor de axios (api.js)
  * ante cualquier 401 que NO sea un intento de login. Es el único punto
  * de entrada para "matar" la sesión desde fuera de React (network layer).
  * CartContext y WishlistContext no necesitan wiring adicional: ya derivan
  * su propio reset de `isAuthenticated`/`user`, así que se limpian solos
  * en cuanto este estado cambia.
  */
  useEffect(() => {
    const handleUnauthorized = () => {
      // api.js ya garantiza que este evento se dispare como máximo una vez
      // por sesión muerta (guarda síncrona sobre localStorage), así que acá
      // no hace falta lógica adicional de deduplicación.
      showToast({
        type: 'warning',
        message: 'Tu sesión expiró. Iniciá sesión nuevamente.',
      });
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [showToast]);

  /* Verifica el token contra el servidor al montar */
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    const { token: newToken, user: newUser } = data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    resetSessionGuard();
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;