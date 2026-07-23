import ApiError from "../utils/ApiError.js";

/**
 * Protege el endpoint de reseed manual (POST /api/system/reseed) con un
 * secreto compartido en vez de JWT — lo llama un cron externo (ej. GitHub
 * Actions) que no tiene sesión de usuario. El secreto viaja en un header,
 * nunca en la URL (evita que quede logueado en query strings).
 */
const reseedAuth = (req, _res, next) => {
  const expected = process.env.RESEED_SECRET;
  if (!expected) {
    return next(new ApiError(500, "RESEED_SECRET no está configurado en el servidor"));
  }

  const provided = req.get("x-reseed-secret");
  if (!provided || provided !== expected) {
    return next(new ApiError(401, "Secreto de reseed inválido o ausente"));
  }

  next();
};

export { reseedAuth };
