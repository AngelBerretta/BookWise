import jwt        from "jsonwebtoken";
import config     from "../../config.js";
import ApiError   from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * authMiddleware — verifica el JWT enviado en el header Authorization.
 *
 * Si el token es válido, carga el payload decodificado en req.user y llama a next().
 * En caso contrario lanza ApiError(401) que el errorMiddleware procesará.
 */
const authMiddleware = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Token de autorización requerido");
  }

  const token = authHeader.split(" ")[1];

  // jwt.verify es síncrono; si falla lanza un error que catchAsync pasa a next()
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch {
    throw new ApiError(401, "Token inválido o expirado");
  }

  req.user = decoded;
  next();
});

export { authMiddleware };
