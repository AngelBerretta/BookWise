import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { title, content, slug, thumbnail, tags, createdAt, author } = post;

  const plainText = (content ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const excerpt   = plainText.length <= 130
    ? plainText
    : plainText.substring(0, plainText.lastIndexOf(' ', 130)) + '…';

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const authorName =
    typeof author === 'object' ? (author?.username ?? 'BookWise') : (author ?? 'BookWise');

  return (
    <article className="group flex flex-col cursor-pointer">

      {/* Imagen */}
      <Link
        to={`/blog/${slug}`}
        className="block rounded-xl overflow-hidden mb-5 bg-[var(--bg-container)]"
        style={{ aspectRatio: '4/5' }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Imagen de ${title}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-[var(--border)]">
              <rect x="6" y="8" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M6 30l9-9 7 7 8-10 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium mb-3">
        {tags?.[0] && <span>{tags[0]}</span>}
        {tags?.[0] && formattedDate && (
          <span className="w-1 h-1 rounded-full bg-[var(--border)] inline-block" />
        )}
        {formattedDate && <time dateTime={createdAt}>{formattedDate}</time>}
      </div>

      {/* Título */}
      <Link to={`/blog/${slug}`} className="flex-1">
        <h3
          className="text-[var(--text-h)] leading-snug mb-3 group-hover:opacity-60 transition-opacity"
          style={{ fontFamily: 'var(--heading)', fontWeight: 500, fontSize: '1.25rem' }}
        >
          {title}
        </h3>
      </Link>

      {/* Excerpt */}
      {excerpt && (
        <p className="text-sm text-[var(--text)] leading-relaxed line-clamp-3 mb-5">
          {excerpt}
        </p>
      )}

      {/* Leer más */}
      <Link
        to={`/blog/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-h)] mt-auto group/link"
      >
        Leer más
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1">
          <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </Link>

    </article>
  );
};

export default PostCard;