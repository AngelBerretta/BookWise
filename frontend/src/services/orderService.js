import api from './api';

/**
 * Servicio de pedidos y checkout con Stripe.
 */

// POST /api/orders — crear el pedido a partir del carrito + dirección de envío
export const createOrder = async (cartId, shippingAddress) => {
  const response = await api.post('/orders', { cartId, shippingAddress });
  return response.data;
};

// GET /api/orders/:oid — obtener un pedido (usado en la Confirmación)
export const getOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// POST /api/orders/:oid/payment-intent — crear/reutilizar el PaymentIntent
export const createPaymentIntent = async (orderId) => {
  const response = await api.post(`/orders/${orderId}/payment-intent`);
  return response.data;
};

// POST /api/orders/:oid/confirm — fallback de confirmación sin Stripe CLI
export const confirmOrder = async (orderId) => {
  const response = await api.post(`/orders/${orderId}/confirm`);
  return response.data;
};
