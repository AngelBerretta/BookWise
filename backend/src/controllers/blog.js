import { postDAO }   from "../models/DAOs/index.js";
import { toPostDTO } from "../models/DTOs/index.js";
import catchAsync    from "../utils/catchAsync.js";   // ← limpio, sin .default
import ApiError      from "../utils/ApiError.js";

// ── GET /api/blog ─────────────────────────────────────────────────────────────

const getPosts = catchAsync(async (req, res) => {
  const filters = {};

  if (req.user?.role === 'admin') {
    const { published } = req.query;
    if (published !== undefined) filters.published = published === 'true';
  } else {
    filters.published = true;
  }

  // 🆕 búsqueda por texto en título o contenido
  const { search } = req.query;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filters.$or = [
      { title:   regex },
      { content: regex },
      { tags:    regex },
    ];
  }

  const posts = await postDAO.getAll(filters);
  return res.status(200).json(posts.map(toPostDTO));
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
  if (req.body.slug) {
    const existing = await postDAO.findOne({ slug: req.body.slug });
    if (existing && String(existing._id) !== String(req.params.id)) {
      throw new ApiError(409, "Ya existe un post con ese slug");
    }
  }

  const updated = await postDAO.update(req.params.id, req.body);
  if (!updated) throw new ApiError(404, "Post no encontrado");
  return res.status(200).json(toPostDTO(updated));
});

// ── DELETE /api/blog/:id ──────────────────────────────────────────────────────

const deletePost = catchAsync(async (req, res) => {
  const deleted = await postDAO.delete(req.params.id);
  if (!deleted) throw new ApiError(404, "Post no encontrado");
  return res.status(200).json({ message: "Post eliminado", post: toPostDTO(deleted) });
});

export { getPosts, getPostBySlug, createPost, updatePost, deletePost };
