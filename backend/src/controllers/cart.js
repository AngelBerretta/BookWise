import { cartDAO, productDAO }      from "../models/DAOs/index.js";
import { toCartDTO }                from "../models/DTOs/index.js";
import catchAsync                   from "../utils/catchAsync.js";
import ApiError                     from "../utils/ApiError.js";
import config                       from "../../config.js";
import CartModel                    from "../models/model/Cart.js";

// ── Helper: populate según modo ───────────────────────────────────────────────

const populateCart = async (cart) => {
  if (config.mode === "fs") {
    const populated = { ...cart };
    populated.products = await Promise.all(
      (cart.products || []).map(async (item) => {
        const product = await productDAO.getById(item.product);
        return { product, quantity: item.quantity };
      })
    );
    return populated;
  }
  return CartModel.findById(cart._id).populate("products.product").lean();
};

// ── POST /api/carts ───────────────────────────────────────────────────────────
// Crear carrito con ID autogenerado

const createCart = catchAsync(async (req, res) => {
  const cart = await cartDAO.create({ user: req.user?._id || null, products: [] });
  return res.status(201).json(toCartDTO(cart));
});

// ── GET /api/carts/:cid ────────────────────────────────────────────────────────
// Listar productos del carrito con populate

const getCart = catchAsync(async (req, res) => {
  const cart = await cartDAO.getById(req.params.cid);
  if (!cart) throw new ApiError(404, "Carrito no encontrado");

  const populated = await populateCart(cart);
  return res.status(200).json(toCartDTO(populated));
});

// ── POST /api/carts/:cid/products/:pid ────────────────────────────────────────
// Agregar producto al carrito; si ya existe, incrementar cantidad

const addProduct = catchAsync(async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await cartDAO.getById(cid);
  if (!cart) throw new ApiError(404, "Carrito no encontrado");

  const product = await productDAO.getById(pid);
  if (!product) throw new ApiError(404, "Producto no encontrado");

  const products = [...(cart.products || [])];
  const idx = products.findIndex(
    (item) => String(item.product) === String(pid)
  );

  if (idx !== -1) {
    products[idx].quantity += 1;
  } else {
    products.push({ product: pid, quantity: 1 });
  }

  const updated   = await cartDAO.update(cid, { products });
  const populated = await populateCart(updated);
  return res.status(200).json(toCartDTO(populated));
});

// ── DELETE /api/carts/:cid/products/:pid ──────────────────────────────────────
// Eliminar un producto del carrito

const removeProduct = catchAsync(async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await cartDAO.getById(cid);
  if (!cart) throw new ApiError(404, "Carrito no encontrado");

  const products = (cart.products || []).filter(
    (item) => String(item.product) !== String(pid)
  );

  const updated   = await cartDAO.update(cid, { products });
  const populated = await populateCart(updated);
  return res.status(200).json(toCartDTO(populated));
});

// ── PUT /api/carts/:cid ────────────────────────────────────────────────────────
// Actualizar todos los productos del carrito

const updateCart = catchAsync(async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products)) throw new ApiError(400, "products debe ser un array");

  const cart = await cartDAO.getById(req.params.cid);
  if (!cart) throw new ApiError(404, "Carrito no encontrado");

  const updated   = await cartDAO.update(req.params.cid, { products });
  const populated = await populateCart(updated);
  return res.status(200).json(toCartDTO(populated));
});

// ── PUT /api/carts/:cid/products/:pid ─────────────────────────────────────────
// Actualizar únicamente la cantidad de un producto

const updateProductQuantity = catchAsync(async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity }  = req.body;

  if (typeof quantity !== "number" || quantity < 1) {
    throw new ApiError(400, "quantity debe ser un número mayor a 0");
  }

  const cart = await cartDAO.getById(cid);
  if (!cart) throw new ApiError(404, "Carrito no encontrado");

  const products = [...(cart.products || [])];
  const idx = products.findIndex(
    (item) => String(item.product) === String(pid)
  );
  if (idx === -1) throw new ApiError(404, "Producto no está en el carrito");

  products[idx].quantity = quantity;

  const updated   = await cartDAO.update(cid, { products });
  const populated = await populateCart(updated);
  return res.status(200).json(toCartDTO(populated));
});

// ── DELETE /api/carts/:cid ────────────────────────────────────────────────────
// Vaciar el carrito (elimina todos los productos, mantiene el documento)

const clearCart = catchAsync(async (req, res) => {
  const cart = await cartDAO.getById(req.params.cid);
  if (!cart) throw new ApiError(404, "Carrito no encontrado");

  const updated = await cartDAO.update(req.params.cid, { products: [] });
  return res.status(200).json(toCartDTO(updated));
});

export {
  createCart,
  getCart,
  addProduct,
  removeProduct,
  updateCart,
  updateProductQuantity,
  clearCart,
};
