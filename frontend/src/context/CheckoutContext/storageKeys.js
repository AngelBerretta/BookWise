// Claves de sessionStorage — por usuario, igual que `cartId_${userId}` en
// CartContext. sessionStorage (no localStorage) a propósito: el checkout es
// un flujo corto, no tiene sentido que sobreviva días entre visitas.
export const addressKey = (userId) => `checkout_address_${userId}`;
export const orderIdKey = (userId) => `checkout_orderId_${userId}`;

export const loadSavedAddress = (userId) => {
  if (!userId) return null;
  try {
    const raw = sessionStorage.getItem(addressKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // sessionStorage no disponible o dato corrupto — no es crítico
  }
};