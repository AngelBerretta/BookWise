/**
 * Formatea un número como precio en pesos argentinos
 * @param {number} price - Precio a formatear
 * @param {boolean} showDecimals - Si mostrar decimales o no (default: true)
 * @returns {string} Precio formateado (ej: $12.500,00)
 */
export const formatPrice = (price, showDecimals = true) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '$0,00';
  }

  const options = {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  };

  return new Intl.NumberFormat('es-AR', options).format(price);
};

/**
 * Formatea un precio con símbolo personalizado
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado sin símbolo de moneda
 */
export const formatPriceNumber = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0,00';
  }

  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Calcula el descuento entre dos precios
 * @param {number} originalPrice - Precio original
 * @param {number} discountedPrice - Precio con descuento
 * @returns {number} Porcentaje de descuento
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
    return 0;
  }

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};
