import { Router } from "express";
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
}                                                  from "../controllers/blog.js";
import { authMiddleware }                          from "../middlewares/auth.middleware.js";
import { roleMiddleware }                          from "../middlewares/role.middleware.js";
import { validate }                                from "../middlewares/validate.middleware.js";
import { createPostSchema, updatePostSchema }      from "../models/schemas/index.js";

const router = Router();

// Middleware de auth OPCIONAL — setea req.user si hay token, no falla si no hay
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // sin token → req.user queda undefined → OK
  }
  return authMiddleware(req, res, next); // con token → verifica y setea req.user
};

// GET /api/blog — público pero reconoce al admin si manda token
router.get("/", optionalAuth, getPosts);

// GET /api/blog/:slug — público
router.get("/:slug", getPostBySlug);

// POST /api/blog — solo admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(createPostSchema),
  createPost
);

// PUT /api/blog/:id — solo admin
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(updatePostSchema),
  updatePost
);

// DELETE /api/blog/:id — solo admin
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deletePost
);

export default router;
