import { Router }                                          from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/users.js";
import { authMiddleware }                                  from "../middlewares/auth.middleware.js";
import { roleMiddleware }                                  from "../middlewares/role.middleware.js";
import { validate }                                        from "../middlewares/validate.middleware.js";
import { updateUserSchema }                                from "../models/schemas/index.js";

const router = Router();

// Todas las rutas de usuarios requieren estar autenticado
router.use(authMiddleware);

// GET  /api/users        — solo admin
router.get("/", roleMiddleware(["admin"]), getAllUsers);

// GET  /api/users/:id    — cualquier usuario autenticado
router.get("/:id", getUserById);

// PUT  /api/users/:id    — el propio usuario o admin
//      (el controlador impide que un no-admin cambie el campo role)
router.put("/:id", validate(updateUserSchema), updateUser);

// DELETE /api/users/:id  — solo admin
router.delete("/:id", roleMiddleware(["admin"]), deleteUser);

export default router;