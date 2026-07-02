import { productDAO }   from "../models/DAOs/index.js";
import { toProductDTO } from "../models/DTOs/index.js";
import catchAsync       from "../utils/catchAsync.js";
import ApiError         from "../utils/ApiError.js";

// ── GET /api/products ─────────────────────────────────────────────────────────

const getProducts = catchAsync(async (req, res) => {
  const {
    limit = 10,
    page  = 1,
    query,          // filtro por categoría o disponibilidad (status=true/false)
    sort,
    search,   // 🆕 búsqueda por texto (title, description)           // "asc" | "desc" — por precio
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

  // ── Ordenamiento ───────────────────────────────────────────────────────────
  const sortObj = {};
  if (sort === "asc")  sortObj.price = 1;
  if (sort === "desc") sortObj.price = -1;

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
  // Evitar que se modifique el _id
  delete req.body._id;

  const updated = await productDAO.update(req.params.pid, req.body);
  if (!updated) throw new ApiError(404, "Producto no encontrado");

  const io = req.app.get("io");
  if (io) io.emit("product:updated", toProductDTO(updated));

  return res.status(200).json(toProductDTO(updated));
});

// ── DELETE /api/products/:pid ─────────────────────────────────────────────────

const deleteProduct = catchAsync(async (req, res) => {
  const deleted = await productDAO.delete(req.params.pid);
  if (!deleted) throw new ApiError(404, "Producto no encontrado");

  const io = req.app.get("io");
  if (io) io.emit("product:deleted", { _id: deleted._id });

  return res.status(200).json({
    message: "Producto eliminado",
    product: toProductDTO(deleted),
  });
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
