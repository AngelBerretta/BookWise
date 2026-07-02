import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/authService';
import * as authService from '../services/authService';

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

  /*
   * Inicializamos el estado de forma sincrónica desde localStorage.
   * Esto evita que ProtectedRoute redirija mientras getMe() aún no respondió.
   */
  const [user, setUser]                     = useState(() => (storedToken ? getUserFromStorage() : null));
  const [token, setToken]                   = useState(() => storedToken);
  const [loading, setLoading]               = useState(!!storedToken); // solo carga si hay token
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!storedToken && !!getUserFromStorage());

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
};

export default AuthContext;
