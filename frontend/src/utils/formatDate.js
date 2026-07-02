/**
 * Formatea una fecha en formato legible en español
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato deseado: 'short', 'long', 'full' (default: 'short')
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }
  };

  return new Intl.DateTimeFormat('es-AR', options[format] || options.short)
    .format(dateObj);
};

/**
 * Formatea una fecha con hora
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha y hora formateadas (ej: 15/04/2024 14:30)
 */
export const formatDateTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Obtiene el tiempo relativo desde una fecha (ej: "hace 2 días")
 * @param {string|Date} date - Fecha a comparar
 * @returns {string} Tiempo relativo
 */
export const getRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);

    if (interval >= 1) {
      if (interval === 1) {
        return `hace 1 ${unit}`;
      }
      // Pluralización simple
      const pluralUnit = unit === 'mes' ? 'meses' : `${unit}s`;
      return `hace ${interval} ${pluralUnit}`;
    }
  }

  return 'recién';
};

/**
 * Verifica si una fecha es hoy
 * @param {string|Date} date - Fecha a verificar
 * @returns {boolean} True si es hoy
 */
export const isToday = (date) => {
  if (!date) return false;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};
