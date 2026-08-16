// Tiempo de espera tras el último click en +/− antes de mandar la request
// real. Si el usuario clickea varias veces seguidas, se debounca todo eso
// en UNA sola request con la cantidad final (menos carga al server y evita
// condiciones de carrera por respuestas que llegan fuera de orden).
export const QUANTITY_DEBOUNCE_MS = 450;

// Extrae el id de producto de un item del carrito, sea que venga populado
// ({ product: {...}, quantity }) o no (fallback por las dudas).
export const getProductId = (item) => item.product?._id ?? item._id;

// Un cartId guardado deja de ser válido si el carrito ya no existe (404) o
// si ya no pertenece al usuario actual (403 — ej: sesión anterior de otra
// persona en el mismo navegador). En ambos casos hay que descartarlo y
// crear uno nuevo.
export const isStaleCartId = (err) => err?.status === 404 || err?.status === 403;