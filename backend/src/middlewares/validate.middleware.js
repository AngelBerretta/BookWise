import ApiError from "../utils/ApiError.js";

/**
 * @param {import("joi").Schema} schema  Schema Joi a aplicar
 */
const validate = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return next(new ApiError(400, `Datos inválidos: ${messages}`));
  }

  next();
};

export { validate };