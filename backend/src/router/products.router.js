import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.js";
import { validate }                                   from "../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema }   from "../models/schemas/index.js";

const router = Router();

// GET  /api/products          — público (limit, page, query, sort)
router.get("/", getProducts);

// GET  /api/products/:pid
router.get("/:pid", getProductById);

// POST /api/products
router.post("/", validate(createProductSchema), createProduct);

// PUT  /api/products/:pid
router.put("/:pid", validate(updateProductSchema), updateProduct);

// DELETE /api/products/:pid
router.delete("/:pid", deleteProduct);

export default router;
