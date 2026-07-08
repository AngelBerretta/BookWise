import Joi from "joi";

// ── Auth ──────────────────────────────────────────────────────────────────────

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "El nombre de usuario debe ser texto",
    "string.min": "El nombre de usuario debe tener al menos 3 caracteres",
    "string.max": "El nombre de usuario no puede superar los 30 caracteres",
    "any.required": "El nombre de usuario es requerido",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "El email no es válido",
    "any.required": "El email es requerido",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es requerida",
  }),
  // Acepta string o número (el controlador lo normaliza a string)
  phone: Joi.alternatives()
    .try(Joi.string(), Joi.number())
    .optional()
    .allow(""),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El email no es válido",
    "any.required": "El email es requerido",
  }),
  password: Joi.string().required().messages({
    "any.required": "La contraseña es requerida",
  }),
});

// ── Users (CRUD — Etapa 4) ────────────────────────────────────────────────────

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional().messages({
    "string.min": "El nombre de usuario debe tener al menos 3 caracteres",
    "string.max": "El nombre de usuario no puede superar los 30 caracteres",
  }),
  phone: Joi.alternatives()
    .try(Joi.string(), Joi.number())
    .optional()
    .allow(""),
  // Solo un admin puede cambiar roles; el controlador debería verificar
  // el rol del solicitante antes de permitir este campo
  role: Joi.string().valid("user", "admin").optional().messages({
    "any.only": 'El rol debe ser "user" o "admin"',
  }),
})
  .min(1)
  .messages({
    "object.min": "Debés enviar al menos un campo para actualizar",
  });

// ── Products ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "ficcion",
  "no-ficcion",
  "ciencia-tecnologia",
  "desarrollo-personal",
  "infantil-juvenil",
  "poesia",
  "ebooks",
];

const createProductSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "El título no puede estar vacío",
    "string.max": "El título no puede superar los 200 caracteres",
    "any.required": "El título es requerido",
  }),
  description: Joi.string().min(1).required().messages({
    "string.min": "La descripción no puede estar vacía",
    "any.required": "La descripción es requerida",
  }),
  code: Joi.string().min(1).required().messages({
    "string.min": "El código no puede estar vacío",
    "any.required": "El código es requerido",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "El precio no puede ser negativo",
    "any.required": "El precio es requerido",
  }),
  status: Joi.boolean().optional().default(true),
  stock: Joi.number().integer().min(0).required().messages({
    "number.integer": "El stock debe ser un número entero",
    "number.min": "El stock no puede ser negativo",
    "any.required": "El stock es requerido",
  }),
  category: Joi.string()
    .valid(...CATEGORIES)
    .required()
    .messages({
      "any.only": `La categoría debe ser una de: ${CATEGORIES.join(", ")}`,
      "any.required": "La categoría es requerida",
    }),
  thumbnails: Joi.array().items(Joi.string().uri()).optional().default([]).messages({
    "array.base": "thumbnails debe ser un array de URLs",
  }),
  thumbnailPublicId: Joi.string().optional().allow(""),
  // campos opcionales de compatibilidad
  url: Joi.string().optional().allow(""),
  author: Joi.string().optional().allow(""),

  pages: Joi.number().integer().min(1).optional().allow(null).messages({
    "number.integer": "El número de páginas debe ser un entero",
    "number.min": "El número de páginas debe ser al menos 1",
  }),
  publicationDate: Joi.string().optional().allow("", null).messages({
    "string.base": "La fecha de publicación debe ser texto",
  }),    
});

const updateProductSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    "string.max": "El título no puede superar los 200 caracteres",
  }),
  description: Joi.string().min(1).optional(),
  code: Joi.string().min(1).optional(),
  price: Joi.number().min(0).optional().messages({
    "number.min": "El precio no puede ser negativo",
  }),
  status: Joi.boolean().optional(),
  stock: Joi.number().integer().min(0).optional().messages({
    "number.integer": "El stock debe ser un número entero",
    "number.min": "El stock no puede ser negativo",
  }),
  category: Joi.string()
    .valid(...CATEGORIES)
    .optional()
    .messages({
      "any.only": `La categoría debe ser una de: ${CATEGORIES.join(", ")}`,
    }),
  thumbnails: Joi.array().items(Joi.string().uri()).optional().messages({
    "array.base": "thumbnails debe ser un array de URLs",
  }),
  thumbnailPublicId: Joi.string().optional().allow(""),
  url: Joi.string().optional().allow(""),
  author: Joi.string().optional().allow(""),

  pages: Joi.number().integer().min(1).optional().allow(null).messages({
    "number.integer": "El número de páginas debe ser un entero",
    "number.min": "El número de páginas debe ser al menos 1",
  }),
  publicationDate: Joi.string().optional().allow("", null).messages({
    "string.base": "La fecha de publicación debe ser texto",
  }),  

})
  .min(1)
  .messages({
    "object.min": "Debés enviar al menos un campo para actualizar",
  });

// ── Bulk actions ──────────────────────────────────────────────────────────────

const bulkIdsSchema = Joi.object({
  ids: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.min": "Debés seleccionar al menos un elemento",
    "any.required": "Los ids son requeridos",
  }),
});

const bulkPublishSchema = Joi.object({
  ids: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.min": "Debés seleccionar al menos un elemento",
    "any.required": "Los ids son requeridos",
  }),
  published: Joi.boolean().required().messages({
    "any.required": "El estado published es requerido",
  }),
});


// ── Cart ──────────────────────────────────────────────────────────────────────

const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "El id del producto es requerido",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.integer": "La cantidad debe ser un número entero",
    "number.min": "La cantidad mínima es 1",
    "any.required": "La cantidad es requerida",
  }),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required().messages({
    "number.integer": "La cantidad debe ser un número entero",
    "number.min": "La cantidad no puede ser negativa",
    "any.required": "La cantidad es requerida",
  }),
});

// ── Blog ──────────────────────────────────────────────────────────────────────

const createPostSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "El título no puede estar vacío",
    "string.max": "El título no puede superar los 200 caracteres",
    "any.required": "El título es requerido",
  }),
  content: Joi.string().min(1).required().messages({
    "string.min": "El contenido no puede estar vacío",
    "any.required": "El contenido es requerido",
  }),
  slug: Joi.string()
    .min(1)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.pattern.base":
        "El slug solo puede contener letras minúsculas, números y guiones",
      "any.required": "El slug es requerido",
    }),
  tags: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Los tags deben ser un array de strings",
  }),
  thumbnail: Joi.string().uri().optional().allow("").messages({
    "string.uri": "El thumbnail debe ser una URL válida",
  }),
  thumbnailPublicId: Joi.string().optional().allow(""),
  published: Joi.boolean().optional(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    "string.max": "El título no puede superar los 200 caracteres",
  }),
  content: Joi.string().min(1).optional(),
  slug: Joi.string()
    .min(1)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .messages({
      "string.pattern.base":
        "El slug solo puede contener letras minúsculas, números y guiones",
    }),
  tags: Joi.array().items(Joi.string()).optional(),
  thumbnail: Joi.string().uri().optional().allow("").messages({
    "string.uri": "El thumbnail debe ser una URL válida",
  }),
  thumbnailPublicId: Joi.string().optional().allow(""),
  published: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "Debés enviar al menos un campo para actualizar",
  });

// ── Exports ───────────────────────────────────────────────────────────────────

export {
  // Auth
  registerSchema,
  loginSchema,
  // Users
  updateUserSchema,
  // Products
  createProductSchema,
  updateProductSchema,
  // Cart
  addToCartSchema,
  updateCartItemSchema,
  // Blog
  createPostSchema,
  updatePostSchema,
  bulkIdsSchema,
  bulkPublishSchema,
};
