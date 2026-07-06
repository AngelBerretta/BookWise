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
const router = Router();

// GET  /api/products          — público (limit, page, query, sort)
router.get("/", getProducts);

// GET  /api/products/meta/max-price — debe ir ANTES de /:pid
router.get("/meta/max-price", getMaxPrice);

// GET  /api/products/:pid
router.get("/:pid", getProductById);

// POST /api/products
router.post("/", validate(createProductSchema), createProduct);

// PUT  /api/products/:pid
router.put("/:pid", validate(updateProductSchema), updateProduct);

// DELETE /api/products/bulk — debe ir ANTES de /:pid
router.delete("/bulk", validate(bulkIdsSchema), bulkDeleteProducts);

// DELETE /api/products/:pid
router.delete("/:pid", deleteProduct);

export default router;
