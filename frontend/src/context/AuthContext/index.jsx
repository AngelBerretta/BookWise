import { createContext } from 'react';
import useAuthState from './useAuthState';
import useUnauthorizedListener from './useUnauthorizedListener';
import useAuthInit from './useAuthInit';
import useAuthActions from './useAuthActions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const {
    user, setUser, token, setToken, loading, setLoading,
    isAuthenticated, setIsAuthenticated,
  } = useAuthState();

  useUnauthorizedListener({ setToken, setUser, setIsAuthenticated });
  useAuthInit({ setUser, setToken, setIsAuthenticated, setLoading });
  const { login, register, logout } = useAuthActions({ setUser, setToken, setIsAuthenticated });

  const value = { user, token, loading, isAuthenticated, login, logout, register };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;