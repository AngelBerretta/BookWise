import axios from 'axios';

/* ------------------------------------------------------------------ */
/*  Rutas 100 % públicas — nunca necesitan token (ni siquiera para     */
/*  reconocer al usuario). Se comparan por prefijo.                    */
/* ------------------------------------------------------------------ */
const ALWAYS_PUBLIC_PREFIXES = ['/products'];

const isAlwaysPublic = (url = '') =>
  ALWAYS_PUBLIC_PREFIXES.some((prefix) => url.startsWith(prefix));

/* ------------------------------------------------------------------ */
/*  Decodifica el payload de un JWT sin verificar firma (solo para     */
/*  chequeo de expiración en cliente — la verificación real la hace    */
/*  el backend).                                                       */
/* ------------------------------------------------------------------ */
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // token malformado → tratarlo como inválido
  }
};

/* ------------------------------------------------------------------ */
/*  Instancia base                                                     */
/* ------------------------------------------------------------------ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ------------------------------------------------------------------ */
/*  Interceptor de request                                             */
/* ------------------------------------------------------------------ */
api.interceptors.request.use(
  (config) => {
    // Endpoints explícitamente públicos → nunca adjuntar token
    if (isAlwaysPublic(config.url)) {
      return config;
    }

    const token = localStorage.getItem('token');

    if (token) {
      if (isTokenExpired(token)) {
        // Token vencido — limpiar sesión y NO mandarlo.
        // Evita 401 en cascada en rutas con auth opcional (ej: /blog).
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------------------------------------------ */
/*  Interceptor de response                                            */
/* ------------------------------------------------------------------ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // El backend rechazó el token → limpiar sesión
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          break;

        case 403:
          console.error('No tienes permisos para realizar esta acción');
          break;

        case 404:
          console.error('Recurso no encontrado');
          break;

        case 500:
          console.error('Error del servidor. Intenta de nuevo más tarde');
          break;

        default:
          console.error(data.message || 'Ocurrió un error inesperado');
      }

      return Promise.reject({
        message: data.message || 'Error en la solicitud',
        status,
        data,
      });
    }

    if (error.request) {
      console.error('No se pudo conectar con el servidor');
      return Promise.reject({
        message: 'No se pudo conectar con el servidor',
        status: 0,
      });
    }

    console.error('Error al realizar la solicitud');
    return Promise.reject({
      message: error.message || 'Error al realizar la solicitud',
      status: 0,
    });
  }
);

export default api;