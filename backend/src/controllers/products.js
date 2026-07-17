import { productDAO }   from "../models/DAOs/index.js";
import { toProductDTO } from "../models/DTOs/index.js";
import catchAsync       from "../utils/catchAsync.js";
import ApiError         from "../utils/ApiError.js";
import { deleteImage }  from "../services/cloudinary.service.js";

// ── GET /api/products ─────────────────────────────────────────────────────────

// Umbral de "stock bajo" — a partir de acá un producto se considera bajo de stock
const LOW_STOCK_THRESHOLD = 5;

const getProducts = catchAsync(async (req, res) => {
  const {
    limit = 10,
    page  = 1,
    query,          // filtro por categoría o disponibilidad (status=true/false)
    sort,
    search,   // 🆕 búsqueda por texto (title, description)           // "asc" | "desc" — por precio
    minPrice,
    maxPrice,
    stock,    // 🆕 "out" (sin stock) | "low" (stock bajo, incluye sin stock)
  } = req.query;

  const limitNum = Math.max(1, parseInt(limit, 10)  || 10);
  const pageNum  = Math.max(1, parseInt(page,  10)  || 1);

  // ── Filtros ────────────────────────────────────────────────────────────────
  const filters = {};

  if (query) {
    // "status=true" | "status=false" | cualquier otra cosa → categoría
    if (query === "status=true")  filters.status = true;
    else if (query === "status=false") filters.status = false;
    else filters.category = query;
  }

  // 🆕 Filtro por texto — busca en title Y description (insensible a mayúsculas)
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filters.$or = [
      { title:       regex },
      { description: regex },
    ];
  }

  // 🆕 Filtro por rango de precio
  const min = minPrice !== undefined ? Number(minPrice) : null;
  const max = maxPrice !== undefined ? Number(maxPrice) : null;
  if ((min !== null && !isNaN(min)) || (max !== null && !isNaN(max))) {
    filters.price = {};
    if (min !== null && !isNaN(min)) filters.price.$gte = min;
    if (max !== null && !isNaN(max)) filters.price.$lte = max;
  } 

  // 🆕 Filtro por stock — "out" = sin stock, "low" = stock bajo (incluye sin stock)
  if (stock === "out") {
    filters.stock = 0;
  } else if (stock === "low") {
    filters.stock = { $lte: LOW_STOCK_THRESHOLD };
  }

  // ── Ordenamiento ───────────────────────────────────────────────────────────
  const sortObj = {};
   switch (sort) {
   case "price-asc":  sortObj.price = 1;  break;
   case "price-desc": sortObj.price = -1; break;
   case "stock-asc":  sortObj.stock = 1;  break;
   case "stock-desc": sortObj.stock = -1; break;
   case "title-asc":  sortObj.title = 1;  break;
   case "newest":
   default:
     sortObj.createdAt = -1;
 }
 sortObj._id = -1;

  // ── Paginación ─────────────────────────────────────────────────────────────
  const { docs, totalDocs, totalPages } = await productDAO.paginate(filters, {
    page:  pageNum,
    limit: limitNum,
    sort:  sortObj,
  });

  // ── Links de paginación ────────────────────────────────────────────────────
  const buildLink = (p) => {
    const params = new URLSearchParams({ limit: limitNum, page: p });
    if (query) params.set("query", query);
    if (sort)  params.set("sort",  sort);
    if (search) params.set("search", search); // 🆕 preservar search en links
    if (min !== null)  params.set("minPrice", min);
    if (max !== null)  params.set("maxPrice", max);
    if (stock) params.set("stock", stock); // 🆕 preservar filtro de stock en links
    return `/api/products?${params.toString()}`;
  };

  const hasPrevPage = pageNum > 1;
  const hasNextPage = pageNum < totalPages;

  return res.status(200).json({
    status:    "success",
    payload:   docs.map(toProductDTO),
    totalDocs,  // 🆕 útil para el frontend
    totalPages,
    prevPage:  hasPrevPage ? pageNum - 1 : null,
    nextPage:  hasNextPage ? pageNum + 1 : null,
    page:      pageNum,
    hasPrevPage,
    hasNextPage,
    prevLink:  hasPrevPage ? buildLink(pageNum - 1) : null,
    nextLink:  hasNextPage ? buildLink(pageNum + 1) : null,
  });
});

// ── GET /api/products/:pid ────────────────────────────────────────────────────

const getProductById = catchAsync(async (req, res) => {
  const product = await productDAO.getById(req.params.pid);
  if (!product) throw new ApiError(404, "Producto no encontrado");
  return res.status(200).json(toProductDTO(product));
});

// ── POST /api/products ────────────────────────────────────────────────────────

const createProduct = catchAsync(async (req, res) => {
  const existing = await productDAO.findOne({ code: req.body.code });
  if (existing) throw new ApiError(409, "Ya existe un producto con ese código");

  const product = await productDAO.create(req.body);

  // Emitir evento WebSocket a todos los clientes conectados
  const io = req.app.get("io");
  if (io) io.emit("product:created", toProductDTO(product));

  return res.status(201).json(toProductDTO(product));
});

// ── PUT /api/products/:pid ────────────────────────────────────────────────────

const updateProduct = catchAsync(async (req, res) => {
  
  delete req.body._id;

  const existing = await productDAO.getById(req.params.pid);
  if (!existing) throw new ApiError(404, "Producto no encontrado");

  const updated = await productDAO.update(req.params.pid, req.body);
  if (!updated) throw new ApiError(404, "Producto no encontrado");

  // Si se reemplazó o quitó la imagen, borrar la anterior de Cloudinary
  const oldPublicId = existing.thumbnailPublicId;
  if (oldPublicId && oldPublicId !== updated.thumbnailPublicId) {
    await deleteImage(oldPublicId);
  }

  const io = req.app.get("io");
  if (io) io.emit("product:updated", toProductDTO(updated));

  return res.status(200).json(toProductDTO(updated));
});

// ── DELETE /api/products/:pid ─────────────────────────────────────────────────

const deleteProduct = catchAsync(async (req, res) => {
  const deleted = await productDAO.delete(req.params.pid);
  if (!deleted) throw new ApiError(404, "Producto no encontrado");

  if (deleted.thumbnailPublicId) {
    await deleteImage(deleted.thumbnailPublicId);
  }

  const io = req.app.get("io");
  if (io) io.emit("product:deleted", { _id: deleted._id });

  return res.status(200).json({
    message: "Producto eliminado",
    product: toProductDTO(deleted),
  });
});

// ── GET /api/products/meta/max-price ──────────────────────────────────────────

const getMaxPrice = catchAsync(async (req, res) => {
  const maxPrice = await productDAO.getMaxPrice();
  return res.status(200).json({ status: "success", maxPrice });
});

 // ── DELETE /api/products/bulk ─────────────────────────────────────────────────

const bulkDeleteProducts = catchAsync(async (req, res) => {
  const { ids } = req.body;

  // Buscar publicIds antes de borrar los documentos
  const docs = await Promise.all(ids.map((id) => productDAO.getById(id)));
  const publicIds = docs.filter(Boolean).map((d) => d.thumbnailPublicId).filter(Boolean);

  const deletedCount = await productDAO.deleteMany(ids);

  await Promise.all(publicIds.map((pid) => deleteImage(pid)));

  const io = req.app.get("io");
  if (io) io.emit("product:bulkDeleted", { ids });

  return res.status(200).json({
    message: `${deletedCount} producto${deletedCount !== 1 ? "s" : ""} eliminado${deletedCount !== 1 ? "s" : ""}`,
    deletedCount,
  });
});


 // ── PATCH /api/products/bulk/category ─────────────────────────────────────────

const bulkUpdateProducts = catchAsync(async (req, res) => {
  const { ids, category } = req.body;
  const modifiedCount = await productDAO.updateMany(ids, { category });

  const io = req.app.get("io");
  if (io) io.emit("product:bulkUpdated", { ids, category });

  return res.status(200).json({
    message: `${modifiedCount} producto${modifiedCount !== 1 ? "s" : ""} actualizado${modifiedCount !== 1 ? "s" : ""}`,
    modifiedCount,
  });
});

export { getProducts, getMaxPrice, getProductById, createProduct, updateProduct, deleteProduct, bulkDeleteProducts, bulkUpdateProducts };
