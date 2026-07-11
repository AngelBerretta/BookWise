import { userDAO, productDAO }        from "../models/DAOs/index.js";
import { toUserDTO, toWishlistDTO }   from "../models/DTOs/index.js";
import catchAsync                     from "../utils/catchAsync.js";
import ApiError                       from "../utils/ApiError.js";
import config                         from "../../config.js";
import UserModel                      from "../models/model/User.js";

// ── Helper: populate según modo — mismo criterio que populateCart ────────────

const populateWishlist = async (user) => {
  const ids = user.wishlist || [];
  if (config.mode === "fs") {
    const products = await Promise.all(ids.map((pid) => productDAO.getById(pid)));
    return products.filter(Boolean); // descarta productos borrados que quedaron referenciados
  }
  const populated = await UserModel.findById(user._id).populate("wishlist").lean();
  return populated?.wishlist || [];
};

// ── GET /api/users/wishlist ────────────────────────────────────────────────────
// Wishlist del usuario autenticado (resuelto por token, no por :id en la URL)

const getWishlist = catchAsync(async (req, res) => {
  const user = await userDAO.getById(req.user._id);
  if (!user) throw new ApiError(404, "Usuario no encontrado");

  const products = await populateWishlist(user);
  return res.status(200).json({ wishlist: toWishlistDTO(products) });
});

// ── POST /api/users/wishlist/:pid ──────────────────────────────────────────────
// Agrega un producto; si ya está, no lo duplica (idempotente)

const addToWishlist = catchAsync(async (req, res) => {
  const { pid } = req.params;

  const product = await productDAO.getById(pid);
  if (!product) throw new ApiError(404, "Producto no encontrado");

  const user = await userDAO.getById(req.user._id);
  if (!user) throw new ApiError(404, "Usuario no encontrado");

  const current = user.wishlist || [];
  const exists  = current.some((id) => String(id) === String(pid));
  const updatedIds = exists ? current : [...current, pid];

  const updated  = await userDAO.update(req.user._id, { wishlist: updatedIds });
  const products = await populateWishlist(updated);
  return res.status(200).json({ wishlist: toWishlistDTO(products) });
});

// ── DELETE /api/users/wishlist/:pid ────────────────────────────────────────────

const removeFromWishlist = catchAsync(async (req, res) => {
  const { pid } = req.params;

  const user = await userDAO.getById(req.user._id);
  if (!user) throw new ApiError(404, "Usuario no encontrado");

  const updatedIds = (user.wishlist || []).filter((id) => String(id) !== String(pid));

  const updated  = await userDAO.update(req.user._id, { wishlist: updatedIds });
  const products = await populateWishlist(updated);
  return res.status(200).json({ wishlist: toWishlistDTO(products) });
});

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
  const target = await userDAO.getById(req.params.id);
  if (!target) throw new ApiError(404, "Usuario no encontrado");
  if (target.isDemo) {
    throw new ApiError(403, "La cuenta demo no se puede modificar.");
  }
  
  // Solo el propio usuario o un admin pueden modificar
  if (req.user._id !== req.params.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'No tenés permisos para modificar este usuario');
  }

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

  const target = await userDAO.getById(req.params.id);
  if (!target) throw new ApiError(404, "Usuario no encontrado");
  if (target.isDemo) {
    throw new ApiError(403, "La cuenta demo no se puede eliminar.");
  }

  const deleted = await userDAO.delete(req.params.id);
  if (!deleted) throw new ApiError(404, "Usuario no encontrado");
  return res.status(200).json({
    message: "Usuario eliminado",
    user: toUserDTO(deleted),
  });
});

export {getAllUsers, getUserById, updateUser, deleteUser, getWishlist, addToWishlist, removeFromWishlist,};