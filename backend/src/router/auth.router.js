import { Router } from "express";
import { register, login, verifyAccount, getMe } from "../controllers/auth.js";
import { authMiddleware }                         from "../middlewares/auth.middleware.js";
import { validate }                               from "../middlewares/validate.middleware.js";
import { rateLimitAuth }                          from "../middlewares/rateLimit.middleware.js";
import { registerSchema, loginSchema }            from "../models/schemas/index.js";

const router = Router();

// POST /api/auth/register  — rate limit estricto
router.post("/register", rateLimitAuth, validate(registerSchema), register);

// POST /api/auth/login  — rate limit estricto
router.post("/login", rateLimitAuth, validate(loginSchema), login);

// GET  /api/auth/verify?token=
router.get("/verify", verifyAccount);

// GET  /api/auth/me  — perfil del usuario autenticado
router.get("/me", authMiddleware, getMe);

export default router;