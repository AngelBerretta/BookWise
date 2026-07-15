import { postDAO }   from "../models/DAOs/index.js";
import { toPostDTO } from "../models/DTOs/index.js";
import catchAsync    from "../utils/catchAsync.js";   // ← limpio, sin .default
import ApiError      from "../utils/ApiError.js";
import { deleteImage } from "../services/cloudinary.service.js";

// ── GET /api/blog ─────────────────────────────────────────────────────────────

const getPosts = catchAsync(async (req, res) => {

  const { limit = 10, page = 1 } = req.query;
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const pageNum  = Math.max(1, parseInt(page, 10)  || 1);

  const filters = {};

  if (req.user?.role === 'admin') {
    const { published } = req.query;
    if (published !== undefined) filters.published = published === 'true';
  } else {
    filters.published = true;
  }

  
  const { search } = req.query;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filters.$or = [
      { title:   regex },
      { content: regex },
      { tags:    regex },
    ];
  }


  const { docs, totalDocs, totalPages } = await postDAO.paginate(filters, {
    page:  pageNum,
    limit: limitNum,
    sort:  { createdAt: -1, _id: -1 },
  });

  const hasPrevPage = pageNum > 1;
  const hasNextPage = pageNum < totalPages;

  return res.status(200).json({
    status:    "success",
    payload:   docs.map(toPostDTO),
    totalDocs,
    totalPages,
    page:      pageNum,
    hasPrevPage,
    hasNextPage,
    prevPage:  hasPrevPage ? pageNum - 1 : null,
    nextPage:  hasNextPage ? pageNum + 1 : null,
  });
});

// ── GET /api/blog/:slug ───────────────────────────────────────────────────────

const getPostBySlug = catchAsync(async (req, res) => {
  const post = await postDAO.findOne({ slug: req.params.slug });
  if (!post) throw new ApiError(404, "Post no encontrado");
  if (!post.published) throw new ApiError(404, "Post no encontrado");
  return res.status(200).json(toPostDTO(post));
});

// ── POST /api/blog ────────────────────────────────────────────────────────────

const createPost = catchAsync(async (req, res) => {
  const existing = await postDAO.findOne({ slug: req.body.slug });
  if (existing) throw new ApiError(409, "Ya existe un post con ese slug");

  const post = await postDAO.create({ ...req.body, author: req.user._id });
  return res.status(201).json(toPostDTO(post));
});

// ── PUT /api/blog/:id ─────────────────────────────────────────────────────────

const updatePost = catchAsync(async (req, res) => {
  const currentPost = await postDAO.getById(req.params.id);
  if (!currentPost) throw new ApiError(404, "Post no encontrado");

  if (req.body.slug) {
    const existingSlug = await postDAO.findOne({ slug: req.body.slug });
    if (existingSlug && String(existingSlug._id) !== String(req.params.id)) {
      throw new ApiError(409, "Ya existe un post con ese slug");
    }
  }

  const updated = await postDAO.update(req.params.id, req.body);
  if (!updated) throw new ApiError(404, "Post no encontrado");

  const oldPublicId = currentPost.thumbnailPublicId;
  if (oldPublicId && oldPublicId !== updated.thumbnailPublicId) {
    await deleteImage(oldPublicId);
  }

  return res.status(200).json(toPostDTO(updated));
});

// ── DELETE /api/blog/:id ──────────────────────────────────────────────────────

const deletePost = catchAsync(async (req, res) => {
  const deleted = await postDAO.delete(req.params.id);
  if (!deleted) throw new ApiError(404, "Post no encontrado");

  if (deleted.thumbnailPublicId) {
    await deleteImage(deleted.thumbnailPublicId);
  }

  return res.status(200).json({ message: "Post eliminado", post: toPostDTO(deleted) });
});

 // ── DELETE /api/blog/bulk ──────────────────────────────────────────────────────

 const bulkDeletePosts = catchAsync(async (req, res) => {
   const { ids } = req.body;
   
   const docs = await Promise.all(ids.map((id) => postDAO.getById(id)));
   const publicIds = docs.filter(Boolean).map((d) => d.thumbnailPublicId).filter(Boolean);

   const deletedCount = await postDAO.deleteMany(ids);

   await Promise.all(publicIds.map((pid) => deleteImage(pid)));

   return res.status(200).json({
     message: `${deletedCount} post${deletedCount !== 1 ? "s" : ""} eliminado${deletedCount !== 1 ? "s" : ""}`,
     deletedCount,
   });
 });

 // ── PATCH /api/blog/bulk/publish ────────────────────────────────────────────────

 const bulkUpdatePosts = catchAsync(async (req, res) => {
   const { ids, published } = req.body;
   const modifiedCount = await postDAO.updateMany(ids, { published });
   return res.status(200).json({
     message: `${modifiedCount} post${modifiedCount !== 1 ? "s" : ""} actualizado${modifiedCount !== 1 ? "s" : ""}`,
     modifiedCount,
   });
 });

export { getPosts, getPostBySlug, createPost, updatePost, deletePost, bulkDeletePosts, bulkUpdatePosts };
