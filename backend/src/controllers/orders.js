import crypto from "node:crypto";

import config from "../../config.js";
import { orderDAO, cartDAO, productDAO } from "../models/DAOs/index.js";
import { toOrderDTO } from "../models/DTOs/index.js";
import Product from "../models/model/Product.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import stripe, { isStripeConfigured, toStripeAmount } from "../services/stripe.service.js";

// ── Helpers ────────────────────────────────────────────────────────────────

// El checkout con Stripe necesita persistencia real (webhooks, PaymentIntents
// que sobreviven a un refresh, etc.) — el modo "fs" es solo un fallback liviano
// para desarrollar sin Mongo y no lo soporta.
const assertMongoMode = () => {
  if (config.mode === "fs") {
    throw new ApiError(
      501,
      "El checkout con Stripe requiere MODE=mongo. No está soportado en modo 'fs'."
    );
  }
};

const assertOwnership = (order, req) => {
  if (String(order.user) !== String(req.user?._id) && req.user?.role !== "admin") {
    throw new ApiError(403, "No tenés permiso para acceder a este pedido");
  }
};

const generateOrderNumber = () =>
  `BW${Date.now().toString(36).toUpperCase()}${crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase()}`;

// ── POST /api/orders ───────────────────────────────────────────────────────
// Crea el pedido a partir del carrito del usuario + la dirección de envío.
// Todavía no crea ningún PaymentIntent — eso pasa en el siguiente paso
// (Payment) para no atarlo a Stripe si el usuario abandona antes de llegar ahí.

const createOrder = catchAsync(async (req, res) => {
  assertMongoMode();

  const { cartId, shippingAddress } = req.body;

  const cart = await cartDAO.getById(cartId);
  if (!cart) throw new ApiError(404, "Carrito no encontrado");
  if (cart.user && String(cart.user) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "No tenés permiso para usar este carrito");
  }
  if (!cart.products?.length) {
    throw new ApiError(400, "El carrito está vacío");
  }

  // Snapshot de cada línea + validación de stock disponible (mismo criterio
  // que addProduct/updateProductQuantity en cart.js)
  const items = [];
  let subtotal = 0;

  for (const line of cart.products) {
    const product = await productDAO.getById(line.product);
    if (!product) {
      throw new ApiError(404, "Uno de los productos del carrito ya no existe");
    }
    if (line.quantity > product.stock) {
      throw new ApiError(
        400,
        `Stock insuficiente para "${product.title}". Disponible: ${product.stock}`
      );
    }
    items.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: line.quantity,
      thumbnail: product.thumbnails?.[0] ?? "",
    });
    subtotal += product.price * line.quantity;
  }

  const shippingCost = 0; // envío gratis en todo el catálogo (igual que en el carrito)
  const total = subtotal + shippingCost;

  const order = await orderDAO.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    cart: cart._id,
    items,
    shippingAddress,
    subtotal,
    shippingCost,
    total,
    currency: config.stripe.currency,
    status: "pending_payment",
  });

  return res.status(201).json(toOrderDTO(order));
});

// ── GET /api/orders/:oid ───────────────────────────────────────────────────

const getOrder = catchAsync(async (req, res) => {
  const order = await orderDAO.getById(req.params.oid);
  if (!order) throw new ApiError(404, "Pedido no encontrado");
  assertOwnership(order, req);

  return res.status(200).json(toOrderDTO(order));
});

// ── POST /api/orders/:oid/payment-intent ──────────────────────────────────
// Crea (o reutiliza) el PaymentIntent de Stripe asociado al pedido.
// Es idempotente: si ya existe uno vigente, lo devuelve en vez de duplicarlo
// — importante porque el usuario puede refrescar la página de pago.

const createPaymentIntent = catchAsync(async (req, res) => {
  assertMongoMode();

  if (!isStripeConfigured) {
    throw new ApiError(
      503,
      "Stripe no está configurado en el servidor. Definí STRIPE_SECRET_KEY en el backend."
    );
  }

  const order = await orderDAO.getById(req.params.oid);
  if (!order) throw new ApiError(404, "Pedido no encontrado");
  assertOwnership(order, req);

  if (order.status === "paid") {
    throw new ApiError(400, "Este pedido ya fue pagado");
  }
  if (order.status === "canceled") {
    throw new ApiError(400, "Este pedido fue cancelado");
  }

  let intent = null;

  if (order.paymentIntentId) {
    intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
    if (intent.status === "canceled") intent = null; // pedimos uno nuevo
  }

  if (!intent) {
    intent = await stripe.paymentIntents.create({
      amount: toStripeAmount(order.total, order.currency),
      currency: order.currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: String(order._id),
        orderNumber: order.orderNumber,
        userId: String(req.user._id),
      },
    });
    await orderDAO.update(order._id, { paymentIntentId: intent.id });
  }

  return res.status(200).json({
    clientSecret: intent.client_secret,
    order: toOrderDTO({ ...order, paymentIntentId: intent.id }),
  });
});

// ── Lógica compartida: confirmar / rechazar pedido ─────────────────────────
// La usan TANTO el webhook (flujo principal) COMO el endpoint de fallback
// de abajo — ambos caminos terminan acá, y ambos son idempotentes: si el
// pedido ya está "paid", no vuelve a descontar stock ni a vaciar el carrito.

const markOrderAsPaid = async (orderId, { confirmedVia }) => {
  const order = await orderDAO.getById(orderId);
  if (!order) return null;
  if (order.status === "paid") return order; // ya confirmado — no-op

  // Descuento de stock — best effort y sin transacción: este proyecto corre
  // sobre un Mongo standalone (sin replica set), que no soporta transacciones
  // multi-documento. Para un e-commerce real conviene reservar stock al crear
  // el pedido (o usar transacciones) para evitar condiciones de carrera.
  await Promise.all(
    (order.items || []).map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  // Vacía el carrito de origen si todavía existe
  if (order.cart) {
    await cartDAO.update(order.cart, { products: [] }).catch(() => null);
  }

  return orderDAO.update(orderId, {
    status: "paid",
    paymentStatus: "succeeded",
    paidAt: new Date(),
    confirmedVia,
  });
};

const markOrderAsFailed = async (orderId, { reason }) => {
  const order = await orderDAO.getById(orderId);
  if (!order || order.status === "paid" || order.status === "failed") return order;

  return orderDAO.update(orderId, {
    status: "failed",
    paymentStatus: reason || "failed",
  });
};

// ── POST /api/orders/:oid/confirm ─────────────────────────────────────────
// Fallback pensado para desarrollo local SIN el Stripe CLI corriendo.
// El flujo principal de confirmación es el webhook (ver más abajo); este
// endpoint existe para no depender de `stripe listen` en cada sesión de
// pruebas. Nunca confía en lo que mande el cliente: vuelve a consultar el
// estado real del PaymentIntent directamente contra la API de Stripe antes
// de confirmar nada. Es idempotente frente al webhook (y viceversa): el que
// llegue primero gana, el segundo es un no-op.

const confirmOrder = catchAsync(async (req, res) => {
  if (!isStripeConfigured) {
    throw new ApiError(503, "Stripe no está configurado en el servidor.");
  }

  const order = await orderDAO.getById(req.params.oid);
  if (!order) throw new ApiError(404, "Pedido no encontrado");
  assertOwnership(order, req);

  if (!order.paymentIntentId) {
    throw new ApiError(400, "Este pedido todavía no tiene un intento de pago asociado");
  }

  const intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

  let updated = order;
  if (intent.status === "succeeded") {
    updated = await markOrderAsPaid(order._id, { confirmedVia: "backend_fallback" });
  } else if (intent.status === "requires_payment_method" || intent.status === "canceled") {
    updated = await markOrderAsFailed(order._id, { reason: intent.status });
  }
  // Otros estados (processing, requires_action, requires_confirmation) →
  // dejamos el pedido como está; el frontend puede reintentar en unos segundos.

  return res.status(200).json(toOrderDTO(updated));
});

// ── POST /api/orders/webhook ───────────────────────────────────────────────
// Flujo PRINCIPAL de confirmación — igual que en producción: Stripe llama a
// esta URL apenas el pago cambia de estado, sin depender de que el navegador
// del cliente siga abierto.
//
// En desarrollo local hace falta reenviar los eventos con el Stripe CLI:
//   stripe listen --forward-to localhost:8080/api/orders/webhook
// y copiar el "whsec_..." que imprime en STRIPE_WEBHOOK_SECRET (backend/.env).
//
// Requiere el body CRUDO (sin parsear por express.json) para poder validar
// la firma — ver el middleware condicional en app.js.

const stripeWebhook = catchAsync(async (req, res) => {
  if (!isStripeConfigured || !config.stripe.webhookSecret) {
    console.warn(
      "[stripeWebhook] Evento recibido pero STRIPE_WEBHOOK_SECRET no está configurado — se ignora."
    );
    return res.status(400).json({ status: "error", message: "Webhook no configurado" });
  }

  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, config.stripe.webhookSecret);
  } catch (err) {
    console.error("[stripeWebhook] Firma inválida:", err.message);
    return res.status(400).json({ status: "error", message: `Webhook Error: ${err.message}` });
  }

  const intent = event.data.object;
  const orderId = intent.metadata?.orderId;

  switch (event.type) {
    case "payment_intent.succeeded":
      if (orderId) await markOrderAsPaid(orderId, { confirmedVia: "webhook" });
      break;

    case "payment_intent.payment_failed":
      if (orderId) {
        await markOrderAsFailed(orderId, {
          reason: intent.last_payment_error?.message || "payment_failed",
        });
      }
      break;

    default:
      break; // otros eventos no nos interesan por ahora
  }

  return res.status(200).json({ received: true });
});

export { createOrder, getOrder, createPaymentIntent, confirmOrder, stripeWebhook };
