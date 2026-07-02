import ApiError from "../utils/ApiError.js";

/**
 * roleMiddleware — verifica que el usuario autenticado tenga uno de los roles permitidos.
 *
 * Debe usarse DESPUÉS de authMiddleware (que ya cargó req.user).
 *
 * Uso:
 *   router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), controller);
 *
 * @param {string[]} roles  Array de roles permitidos, ej: ["admin"] o ["admin", "editor"]
 */
const roleMiddleware = (roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "No autenticado"));
  }

  if (!roles.includes(req.user.role)) {
    return next(
      new ApiError(403, "No tenés permisos para realizar esta acción")
    );
  }

  next();
};

export { roleMiddleware };