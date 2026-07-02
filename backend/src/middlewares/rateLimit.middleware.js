import rateLimit from "express-rate-limit";

/**
 * rateLimitGeneral — límite general para todas las rutas.
 * 100 peticiones por IP cada 15 minutos.
 */
const rateLimitGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,  // Incluye RateLimit-* headers (RFC 6585)
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Demasiadas peticiones. Intentá de nuevo en 15 minutos.",
  },
});

/**
 * rateLimitAuth — límite estricto para rutas de autenticación.
 * 10 peticiones por IP cada 15 minutos (protege contra fuerza bruta).
 */
const rateLimitAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Demasiados intentos de autenticación. Intentá de nuevo en 15 minutos.",
  },
});

export { rateLimitGeneral, rateLimitAuth };