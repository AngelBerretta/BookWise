// ── User DTO ──────────────────────────────────────────────────────────────────

const toUserDTO = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});

// ── Product DTO ───────────────────────────────────────────────────────────────

const toProductDTO = (product) => ({
  _id: product._id,
  title: product.title,
  description: product.description,
  code: product.code,
  price: product.price,
  status: product.status,
  stock: product.stock,
  category: product.category,
  thumbnails: product.thumbnails ?? [],
  thumbnail: product.thumbnails?.[0] ?? product.url ?? '',
  // campos de compatibilidad del proyecto original
  url: product.url,
  author: product.author,
  pages: product.pages,                    
  publicationDate: product.publicationDate, 
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

// ── Cart DTO ──────────────────────────────────────────────────────────────────

const toCartDTO = (cart) => ({
  _id: cart._id,
  user: cart.user,
  products: (cart.products || []).map((item) => ({
    product: item.product && item.product._id
      ? toProductDTO(item.product)
      : item.product,
    quantity: item.quantity,
  })),
  createdAt: cart.createdAt,
  updatedAt: cart.updatedAt,
});

// ── Post DTO ──────────────────────────────────────────────────────────────────

const toPostDTO = (post) => ({
  _id: post._id,
  title: post.title,
  content: post.content,
  slug: post.slug,
  tags: post.tags,
  thumbnail: post.thumbnail,
  published: post.published,
  author: post.author && post.author._id ? toUserDTO(post.author) : post.author,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

export { toUserDTO, toProductDTO, toCartDTO, toPostDTO };
