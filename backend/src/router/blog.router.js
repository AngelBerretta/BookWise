import { Router } from "express";
import jwt from "jsonwebtoken";
import config from "../../config.js";
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  bulkDeletePosts,
  bulkUpdatePosts,
}                                                  from "../controllers/blog.js";
import { authMiddleware }                          from "../middlewares/auth.middleware.js";
import { roleMiddleware }                          from "../middlewares/role.middleware.js";
import { demoGuard }                                from "../middlewares/demoGuard.middleware.js";
import { validate }                                from "../middlewares/validate.middleware.js";
import { createPostSchema, updatePostSchema, bulkIdsSchema, bulkPublishSchema } from "../models/schemas/index.js";

const router = Router();

// Middleware de auth OPCIONAL — setea req.user si hay token, no falla si no hay
/**  * Middleware de auth OPCIONAL — para rutas públicas que quieren
  * reconocer al admin si viene autenticado, pero NUNCA deben bloquear
  * a un usuario anónimo o con token vencido/inválido.
  * A diferencia de authMiddleware, acá un token malo simplemente
  * se ignora (req.user queda undefined) en vez de responder 401.
  */
const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, config.jwt.secret);
  } catch {
    // Token inválido o expirado en ruta pública → seguir como anónimo
  }
  return next();
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

 // DELETE /api/blog/bulk — debe ir ANTES de /:id
router.delete(
  "/bulk",
  authMiddleware,
  roleMiddleware(["admin"]),
  demoGuard,
  validate(bulkIdsSchema),
  bulkDeletePosts
);

// PATCH /api/blog/bulk/publish
router.patch(
  "/bulk/publish",
  authMiddleware,
  roleMiddleware(["admin"]),
  validate(bulkPublishSchema),
  bulkUpdatePosts
);

// DELETE /api/blog/:id — solo admin
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  demoGuard,
  deletePost
);

export default router;
