import minimist from "minimist";
const args = minimist(process.argv.slice(2));

// ── Modo de persistencia ──────────────────────────────────────────────────────
// Se puede pasar por CLI: node src/app.js --mode fs
// O por variable de entorno: MODE=fs
const MODE = args.mode || process.env.MODE || "mongo";

const config = {
  // ── General ────────────────────────────────────────────────────────────────
  mode: MODE,

  // ── Servidor ───────────────────────────────────────────────────────────────
  server: {
    port: process.env.PORT || 8080,
  },

  // ── MongoDB ────────────────────────────────────────────────────────────────
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
  },

  // ── JSON Web Token ─────────────────────────────────────────────────────────
  jwt: {
    secret:    process.env.JWT_SECRET    || "bookwise_secret_key_dev",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  // ── SendGrid ───────────────────────────────────────────────────────────────
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || "",
    from:   process.env.SENDGRID_FROM    || "no-reply@bookwise.com",
  },

  // ── Cloudinary ─────────────────────────────────────────────────────────────
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey:    process.env.CLOUDINARY_API_KEY    || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  // ── Cliente (CORS) ─────────────────────────────────────────────────────────
  client: {
    url: process.env.CLIENT_URL || "http://localhost:5173",
  },

  // ── Stripe (checkout en modo test) ────────────────────────────────────────
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    // La genera `stripe listen --forward-to localhost:8080/api/orders/webhook`
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    // Moneda del checkout — debe estar habilitada en tu cuenta de Stripe.
    // Por default usa la misma moneda que el catálogo (ARS); si tu cuenta de
    // Stripe test no la acepta, cambiala a "usd" en el .env.
    currency: (process.env.STRIPE_CURRENCY || "ars").toLowerCase(),
  },

  // ── Bcrypt ─────────────────────────────────────────────────────────────────
  bcrypt: {
    saltRounds: 10,
  },
};

export default config;

