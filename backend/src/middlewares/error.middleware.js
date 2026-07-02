import ApiError from "../utils/ApiError.js";

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  // Error operacional lanzado intencionalmente con ApiError
  if (err instanceof ApiError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Error inesperado: logueamos el stack completo pero no lo exponemos al cliente
  console.error("[Unhandled Error]", err);

  return res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
};

export { errorMiddleware };