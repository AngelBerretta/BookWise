import ApiError from "../utils/ApiError.js";

/**
 * Bloquea acciones destructivas para la cuenta admin demo — protege el
 * portfolio de un visitante que borre todo el catálogo, sin perder la
 * posibilidad de mostrar crear/editar en vivo.
 */
const demoGuard = (req, _res, next) => {
  if (req.user?.isDemo) {
    return next(
      new ApiError(403, "Esta acción está deshabilitada en el modo demo.")
    );
  }
  next();
};

export { demoGuard };