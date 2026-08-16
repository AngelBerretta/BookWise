import { useCallback } from 'react';
import * as authService from '../../services/authService';
import { resetSessionGuard } from '../../services/api';
import { persistSession, clearSession } from './authStorage';

/** login / register / logout — únicas mutaciones del estado de sesión. */
const useAuthActions = ({ setUser, setToken, setIsAuthenticated }) => {
  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    const { token: newToken, user: newUser } = data;
    persistSession(newToken, newUser);
    resetSessionGuard();
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    return data;
  }, [setUser, setToken, setIsAuthenticated]);

  const register = useCallback(async (userData) => {
    return authService.register(userData);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, [setUser, setToken, setIsAuthenticated]);

  return { login, register, logout };
};

export default useAuthActions;