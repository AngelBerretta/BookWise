import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de request: agrega el token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: maneja errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores comunes
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token inválido o expirado — limpiar sesión sin forzar recarga
          // El AuthContext y ProtectedRoute se encargan de redirigir
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          break;

        case 403:
          // Sin permisos
          console.error('No tienes permisos para realizar esta acción');
          break;

        case 404:
          // Recurso no encontrado
          console.error('Recurso no encontrado');
          break;

        case 500:
          // Error del servidor
          console.error('Error del servidor. Intenta de nuevo más tarde');
          break;

        default:
          console.error(data.message || 'Ocurrió un error inesperado');
      }

      // Devolver el mensaje de error del backend si existe
      return Promise.reject({
        message: data.message || 'Error en la solicitud',
        status,
        data
      });
    } else if (error.request) {
      // La request se hizo pero no hubo respuesta
      console.error('No se pudo conectar con el servidor');
      return Promise.reject({
        message: 'No se pudo conectar con el servidor',
        status: 0
      });
    } else {
      // Error al configurar la request
      console.error('Error al realizar la solicitud');
      return Promise.reject({
        message: error.message || 'Error al realizar la solicitud',
        status: 0
      });
    }
  }
);

export default api;
