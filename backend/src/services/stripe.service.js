import Stripe from "stripe";
import config from "../../config.js";

// ── Verificar si Stripe está configurado ──────────────────────────────────────
// Mismo criterio que email.service.js con SendGrid: si falta la clave, el
// servidor arranca igual (no rompe todo el proyecto) y recién falla, con un
// mensaje claro, cuando alguien intenta efectivamente pagar.
const isStripeConfigured = Boolean(
  config.stripe.secretKey && config.stripe.secretKey.startsWith("sk_")
);

let stripe = null;

if (isStripeConfigured) {
  stripe = new Stripe(config.stripe.secretKey);
  console.log(
    `💳  Stripe configurado correctamente (modo ${
      config.stripe.secretKey.startsWith("sk_live_") ? "LIVE ⚠️" : "TEST"
    })`
  );
} else {
  console.log(
    "⚠️   Stripe no configurado - el checkout con tarjeta no va a funcionar hasta que definas STRIPE_SECRET_KEY"
  );
}

// ── Monedas de cero decimales ─────────────────────────────────────────────────
// Stripe espera el monto en la unidad mínima de la moneda (ej: centavos).
// Estas monedas no tienen subunidad — se mandan "tal cual", sin multiplicar.
// https://docs.stripe.com/currencies#zero-decimal
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

/**
 * Convierte un monto "humano" (ej: 15500.50) al entero que espera la API de
 * Stripe para una moneda dada (ej: 1550050 centavos, o 15500 si es JPY).
 */
const toStripeAmount = (amount, currency) => {
  const normalized = (currency || "").toLowerCase();
  if (ZERO_DECIMAL_CURRENCIES.has(normalized)) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
};

export default stripe;
export { isStripeConfigured, toStripeAmount };
