import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar formularios con loading y error.
 *
 * @param {Function} asyncFn - Función async que recibe los datos del formulario
 * @returns {{ handleSubmit, loading, error, clearError }}
 *
 * @example
 * const { handleSubmit, loading, error } = useForm(async (data) => {
 *   await authService.login(data);
 * });
 */
const useForm = (asyncFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Envuelve asyncFn con manejo de estado loading/error.
   * @param {Object} data - Datos del formulario
   */
  const handleSubmit = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        await asyncFn(data);
      } catch (err) {
        // Normaliza el mensaje de error
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error  ||
          err?.message                ||
          'Ocurrió un error inesperado. Intentá de nuevo.';

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  );

  return { handleSubmit, loading, error, clearError };
};

export default useForm;