/**
 * ApiError — clase de error operacional para el API.
 *
 * Uso:
 *   throw new ApiError(404, "Usuario no encontrado");
 *   throw new ApiError(403, "Acceso denegado");
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode  Código HTTP (4xx / 5xx)
   * @param {string} message     Mensaje legible para el cliente
   * @param {boolean} isOperational  true = error esperado; false = bug inesperado
   */
  constructor(statusCode, message, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Mantiene el stack trace limpio (Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;