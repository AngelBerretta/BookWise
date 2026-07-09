import { Router } from "express";
import {
  getProducts,
  getMaxPrice,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
} from "../controllers/products.js";
import { validate }                                   from "../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema, bulkIdsSchema } from "../models/schemas/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { demoGuard }      from "../middlewares/demoGuard.middleware.js";

const router = Router();

// GET  /api/products          — público (limit, page, query, sort)
router.get("/", getProducts);

// GET  /api/products/meta/max-price — debe ir ANTES de /:pid
router.get("/meta/max-price", getMaxPrice);

// GET  /api/products/:pid
router.get("/:pid", getProductById);

// POST /api/products — solo admin
router.post("/", authMiddleware, roleMiddleware(["admin"]), validate(createProductSchema), createProduct);

// PUT  /api/products/:pid — solo admin
router.put("/:pid", authMiddleware, roleMiddleware(["admin"]), validate(updateProductSchema), updateProduct);

// DELETE /api/products/bulk — solo admin, bloqueado en modo demo
router.delete("/bulk", authMiddleware, roleMiddleware(["admin"]), demoGuard, validate(bulkIdsSchema), bulkDeleteProducts);

// DELETE /api/products/:pid — solo admin, bloqueado en modo demo
router.delete("/:pid", authMiddleware, roleMiddleware(["admin"]), demoGuard, deleteProduct);

export default router;
