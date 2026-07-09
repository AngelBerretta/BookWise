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

/**
 * Límite específico para escrituras (crear/editar) hechas por la cuenta
 * demo. Se salta por completo para usuarios reales — `skip` evalúa
 * req.user, por eso este middleware debe ir DESPUÉS de authMiddleware.
 */
const rateLimitDemoWrite = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.user?.isDemo,
  message: {
    status: "error",
    message: "Demasiadas acciones en modo demo. Esperá unos minutos y volvé a intentar.",
  },
});

/**
 * Límite más estricto para subida de imágenes en modo demo — es el vector
 * más directo para intentar colar contenido inapropiado.
 */
const rateLimitDemoUpload = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.user?.isDemo,
  message: {
    status: "error",
    message: "Demasiadas imágenes subidas en modo demo. Esperá unos minutos.",
  },
});

export { rateLimitDemoWrite, rateLimitDemoUpload };