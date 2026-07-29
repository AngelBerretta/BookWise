import mongoose from "mongoose";

// ── Ítem de pedido ────────────────────────────────────────────────────────────
// Se guarda un "snapshot" de título/precio/miniatura al momento de la compra:
// así el pedido no cambia si el producto se edita o se borra después.
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    thumbnail: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// ── Dirección de envío ────────────────────────────────────────────────────────
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    province: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: "Argentina" },
    notes: { type: String, default: "", trim: true },
  },
  { _id: false }
);

// ── Estados del pedido ────────────────────────────────────────────────────────
// pending_payment → recién creado, esperando que el usuario pague
// paid            → PaymentIntent confirmado (por webhook o por el fallback)
// failed          → el pago falló o fue rechazado
// canceled        → cancelado antes de pagar (no usado por ahora, reservado)
const ORDER_STATUSES = ["pending_payment", "paid", "failed", "canceled"];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Referencia al carrito de origen — se vacía automáticamente cuando el
    // pago se confirma. Puede quedar null si el carrito ya no existe.
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      default: null,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "El pedido debe tener al menos un producto",
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    // Moneda ISO en minúsculas, tal cual la espera la API de Stripe (ej: "ars", "usd")
    currency: {
      type: String,
      required: true,
      default: "ars",
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending_payment",
    },
    // ── Datos de Stripe ──
    paymentIntentId: {
      type: String,
      default: null,
      index: true,
    },
    paymentStatus: {
      type: String,
      default: "",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    // Qué mecanismo confirmó el pago — solo informativo/debug.
    // "webhook"         → confirmado por el webhook de Stripe (flujo principal)
    // "backend_fallback" → confirmado por el endpoint de fallback (sin Stripe CLI)
    confirmedVia: {
      type: String,
      enum: ["webhook", "backend_fallback", null],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
export { ORDER_STATUSES };
