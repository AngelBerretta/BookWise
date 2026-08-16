import { useState } from 'react';
import { getUserFromStorage } from './authStorage';

/**
 * Inicializa el estado de forma sincrónica desde localStorage.
 * Esto evita que ProtectedRoute redirija mientras getMe() aún no respondió.
 */
const useAuthState = () => {
  const storedToken = localStorage.getItem('token');

  const [user, setUser] = useState(() => (storedToken ? getUserFromStorage() : null));
  const [token, setToken] = useState(() => storedToken);
  const [loading, setLoading] = useState(!!storedToken); // solo carga si hay token
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!storedToken && !!getUserFromStorage()
  );

  return {
    user, setUser, token, setToken, loading, setLoading,
    isAuthenticated, setIsAuthenticated,
  };
};

export default useAuthState;