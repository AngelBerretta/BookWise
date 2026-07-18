import bcrypt  from "bcryptjs";
import jwt     from "jsonwebtoken";
import crypto  from "node:crypto";           // ← prefijo node: recomendado en ESM

import config                    from "../../config.js";
import { userDAO }               from "../models/DAOs/index.js";
import { toUserDTO }             from "../models/DTOs/index.js";
import { sendVerificationEmail } from "../services/email.service.js";
import catchAsync                from "../utils/catchAsync.js";
import ApiError                  from "../utils/ApiError.js";


// ── POST /api/auth/register ───────────────────────────────────────────────────

const register = catchAsync(async (req, res) => {
  const { username, email, password, phone } = req.body;

  const existing = await userDAO.findOne({ email });
  if (existing) {
    throw new ApiError(409, "El email ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const newUser = await userDAO.create({
    username,
    email,
    password: hashedPassword,
    phone: phone ? String(phone) : "",
    verificationToken,
    isVerified: false,
  });

  // El email no bloquea el registro si falla
  try {
    await sendVerificationEmail(email, username, verificationToken);
  } catch (emailErr) {
    console.error("[register] Error al enviar email:", emailErr.message);
  }

  return res.status(201).json({
    message: "Usuario registrado. Revisá tu email para verificar la cuenta.",
    user: toUserDTO(newUser),
  });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await userDAO.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Credenciales incorrectas");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Credenciales incorrectas");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Cuenta no verificada. Revisá tu email.");
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role, isDemo: user.isDemo ?? false },
    config.jwt.secret,
    { expiresIn: user.isDemo ? "1h" : config.jwt.expiresIn }
  );

  return res.status(200).json({ token, user: toUserDTO(user) });
});

// ── GET /api/auth/verify?token= ───────────────────────────────────────────────

const verifyAccount = catchAsync(async (req, res) => {
  const { token } = req.query;
  if (!token) throw new ApiError(400, "Token requerido");

  const user = await userDAO.findOne({ verificationToken: token });
  if (!user) throw new ApiError(400, "Token inválido o expirado");

  await userDAO.update(user._id, {
    isVerified: true,
    verificationToken: null,
  });

  return res.status(200).json({ message: "Cuenta verificada exitosamente" });
});

// ── GET /api/auth/me  (requiere authMiddleware) ───────────────────────────────

const getMe = catchAsync(async (req, res) => {
  const user = await userDAO.getById(req.user._id);
  if (!user) throw new ApiError(404, "Usuario no encontrado");
  return res.status(200).json({ user: toUserDTO(user) });
});

export { register, login, verifyAccount, getMe };