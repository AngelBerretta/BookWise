import { ProfanityEngine } from "@coffeeandfun/google-profanity-words";
import ApiError from "../utils/ApiError.js";

const profanityEs = new ProfanityEngine({ language: "es" });
const profanityEn = new ProfanityEngine({ language: "en" });

// Campos de texto a revisar en productos y posts
const FIELDS_TO_CHECK = ["title", "description", "author", "content"];

const containsProfanity = async (text) => {
  if (!text || typeof text !== "string") return false;
  const [esHit, enHit] = await Promise.all([
    profanityEs.hasCurseWords(text),
    profanityEn.hasCurseWords(text),
  ]);
  return esHit || enHit;
};

/**
 * Bloquea lenguaje explícito/ofensivo en el contenido creado por la cuenta
 * admin demo. No reemplaza una moderación real, pero corta el abuso más
 * obvio y evidente sin fricción para el admin real.
 */
const demoContentFilter = async (req, res, next) => {
  if (!req.user?.isDemo) return next();

  try {
    const texts = [
      ...FIELDS_TO_CHECK.map((field) => req.body?.[field]),
      ...(Array.isArray(req.body?.tags) ? req.body.tags : []),
    ];

    for (const text of texts) {
      if (await containsProfanity(text)) {
        throw new ApiError(
          400,
          "El contenido no se puede publicar en modo demo — contiene lenguaje no permitido."
        );
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

export { demoContentFilter };