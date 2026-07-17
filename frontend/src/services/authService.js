// frontend/src/services/authService.js
import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // ✅ Solo retorna los datos — AuthContext es el único responsable
  // del localStorage. Eliminados los localStorage.setItem de aquí.
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  // ✅ Mismo criterio: getMe tampoco debería escribir localStorage.
  // AuthContext.initAuth() ya hace el setItem después de llamar a getMe().
  return response.data;
};

export const verifyAccount = async (token) => {
  const response = await api.get(`/auth/verify?token=${token}`);
  return response.data;
};

// ✅ logout en el service solo limpia storage si se llama directo
// (fuera del contexto). Dentro de la app siempre usar AuthContext.logout()
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};