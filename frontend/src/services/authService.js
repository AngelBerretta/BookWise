// frontend/src/services/authService.js
import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    // ✅ Solo retorna los datos — AuthContext es el único responsable
    // del localStorage. Eliminados los localStorage.setItem de aquí.
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    // ✅ Mismo criterio: getMe tampoco debería escribir localStorage.
    // AuthContext.initAuth() ya hace el setItem después de llamar a getMe().
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyAccount = async (token) => {
  try {
    const response = await api.get(`/auth/verify?token=${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
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
  } catch (error) {
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};