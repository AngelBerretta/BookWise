import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOrderSchema } from "../models/schemas/index.js";
import {
  createOrder,
  getOrder,
  createPaymentIntent,
  confirmOrder,
  stripeWebhook,
} from "../controllers/orders.js";

const router = Router();

// POST /api/orders/webhook — SIN authMiddleware: lo llama Stripe, no un
// usuario logueado. El body crudo (requerido para validar la firma) se
// configura en app.js exclusivamente para esta ruta.
router.post("/webhook", stripeWebhook);

router.use(authMiddleware);

// POST   /api/orders                       — crear pedido desde el carrito
router.post("/", validate(createOrderSchema), createOrder);

// GET    /api/orders/:oid                  — ver un pedido (para Confirmación)
router.get("/:oid", getOrder);

// POST   /api/orders/:oid/payment-intent   — crear/reutilizar el PaymentIntent
router.post("/:oid/payment-intent", createPaymentIntent);

// POST   /api/orders/:oid/confirm          — fallback sin Stripe CLI
router.post("/:oid/confirm", confirmOrder);

export default router;
