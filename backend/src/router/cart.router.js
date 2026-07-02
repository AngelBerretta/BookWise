import { Router } from "express";
import {
  createCart,
  getCart,
  addProduct,
  removeProduct,
  updateCart,
  updateProductQuantity,
  clearCart,
} from "../controllers/cart.js";

const router = Router();

// POST   /api/carts                          — crear carrito
router.post("/", createCart);

// GET    /api/carts/:cid                     — ver carrito con populate
router.get("/:cid", getCart);

// POST   /api/carts/:cid/products/:pid       — agregar producto (o incrementar)
router.post("/:cid/products/:pid", addProduct);

// DELETE /api/carts/:cid/products/:pid       — eliminar un producto del carrito
router.delete("/:cid/products/:pid", removeProduct);

// PUT    /api/carts/:cid                     — reemplazar todos los productos
router.put("/:cid", updateCart);

// PUT    /api/carts/:cid/products/:pid       — actualizar cantidad de un producto
router.put("/:cid/products/:pid", updateProductQuantity);

// DELETE /api/carts/:cid                     — vaciar carrito
router.delete("/:cid", clearCart);

export default router;
