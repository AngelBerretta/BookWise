import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Ruta protegida que requiere autenticación.
 * Opcionalmente verifica el rol del usuario (ej: "admin").
 *
 * @param {string} requiredRole - Rol requerido para acceder a la ruta (opcional)
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Mientras verificamos el token no redirigimos aún
  if (loading) return null;

  // No autenticado → redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero sin el rol requerido → redirigir a home
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
