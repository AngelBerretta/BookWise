/**
 * catchAsync — wrapper para controladores async.
 *
 * Elimina la necesidad de escribir try/catch en cada controlador.
 * Captura cualquier rechazo de la promesa y lo pasa a next(),
 * donde el error.middleware lo procesará.
 *
 * Uso:
 *   router.get("/", catchAsync(async (req, res, next) => { ... }));
 *
 * @param {Function} fn  Función async de Express (req, res, next)
 * @returns {Function}   Middleware de Express con manejo de errores
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;