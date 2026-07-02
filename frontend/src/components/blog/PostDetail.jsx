/**
 * Muestra el contenido completo de un post del blog.
 *
 * @param {{ post: Object }} props
 *   post.title     → título
 *   post.content   → contenido (texto plano con saltos de línea)
 *   post.thumbnail → URL de imagen de portada (opcional)
 *   post.tags      → array de tags
 *   post.createdAt → fecha ISO
 *   post.author    → objeto { username } o string
 */
const PostDetail = ({ post }) => {
  const { title, content, thumbnail, tags, createdAt, updatedAt, author } = post;

  /* ── Fecha ── */
  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null;

  const publishedDate = formatDate(createdAt);
  const editedDate    = updatedAt && updatedAt !== createdAt ? formatDate(updatedAt) : null;

  /* ── Autor ── */
  const authorName =
    typeof author === 'object' ? (author?.username ?? 'BookWise') : (author ?? 'BookWise');

  return (
    <article className="max-w-3xl mx-auto">

      {/* Imagen hero */}
      {thumbnail && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border)] mb-8 bg-[var(--code-bg)]">
          <img
            src={thumbnail}
            alt={`Imagen de ${title}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-bg)] text-[var(--accent)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Título */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-h)] leading-tight mb-5">
        {title}
      </h1>

      {/* Meta del autor y fechas */}
      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[var(--border)]">
        {/* Avatar placeholder */}
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent-bg)] shrink-0">
          <span className="text-sm font-semibold text-[var(--accent)]">
            {authorName.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-[var(--text-h)]">{authorName}</span>
          <div className="flex items-center gap-2 text-xs text-[var(--text)] opacity-70">
            {publishedDate && (
              <time dateTime={createdAt}>{publishedDate}</time>
            )}
            {editedDate && (
              <>
                <span>·</span>
                <span>Editado el {editedDate}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenido completo — respeta saltos de línea */}
      <div className="prose-bookwise">
        {(content ?? '').split('\n').map((paragraph, i) =>
          paragraph.trim() ? (
            <p
              key={i}
              className="text-[var(--text)] leading-relaxed text-base mb-5 last:mb-0"
            >
              {paragraph}
            </p>
          ) : (
            /* Línea en blanco → espacio visual entre bloques */
            <div key={i} className="h-2" aria-hidden="true" />
          )
        )}
      </div>

    </article>
  );
};

export default PostDetail;