import { userDAO }   from "../models/DAOs/index.js";
import { toUserDTO } from "../models/DTOs/index.js";
import catchAsync    from "../utils/catchAsync.js";
import ApiError      from "../utils/ApiError.js";

// ── GET /api/users  (solo admin) ──────────────────────────────────────────────

const getAllUsers = catchAsync(async (_req, res) => {
  const users = await userDAO.getAll();
  return res.status(200).json(users.map(toUserDTO));
});

// ── GET /api/users/:id ────────────────────────────────────────────────────────

const getUserById = catchAsync(async (req, res) => {
  const user = await userDAO.getById(req.params.id);
  if (!user) throw new ApiError(404, "Usuario no encontrado");
  return res.status(200).json(toUserDTO(user));
});

// ── PUT /api/users/:id ────────────────────────────────────────────────────────

const updateUser = catchAsync(async (req, res) => {
  // Solo un admin puede cambiar el role de otro usuario
  if (req.body.role && req.user.role !== "admin") {
    throw new ApiError(403, "No tenés permisos para cambiar el rol");
  }

  const updated = await userDAO.update(req.params.id, req.body);
  if (!updated) throw new ApiError(404, "Usuario no encontrado");
  return res.status(200).json(toUserDTO(updated));
});

// ── DELETE /api/users/:id  (solo admin) ───────────────────────────────────────

const deleteUser = catchAsync(async (req, res) => {
  // Evita que un admin se elimine a sí mismo
  if (String(req.params.id) === String(req.user._id)) {
    throw new ApiError(400, "No podés eliminar tu propia cuenta");
  }

  const deleted = await userDAO.delete(req.params.id);
  if (!deleted) throw new ApiError(404, "Usuario no encontrado");
  return res.status(200).json({
    message: "Usuario eliminado",
    user: toUserDTO(deleted),
  });
});

export { getAllUsers, getUserById, updateUser, deleteUser };