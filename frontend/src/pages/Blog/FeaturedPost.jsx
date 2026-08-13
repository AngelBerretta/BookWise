import { Link } from 'react-router-dom';
import { stripMarkdown } from '../../utils/markdown';

/** Post destacado — layout asimétrico, solo en la primera página sin búsqueda. */
const FeaturedPost = ({ post }) => {
  const { title, content, slug, thumbnail, tags, createdAt } = post;

  const plainText = stripMarkdown(content);
  const excerpt = plainText.length <= 200
    ? plainText
    : plainText.substring(0, plainText.lastIndexOf(' ', 200)) + '…';

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <Link
      to={`/blog/${slug}`}
      className="group grid grid-cols-1 lg:grid-cols-12 gap-0 items-center rounded-xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--border)] transition-colors"
      style={{ background: 'var(--bg-subtle)' }}
    >
      <div className="lg:col-span-7 h-64 lg:h-[440px] overflow-hidden bg-[var(--bg-container)]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 text-[var(--border)]">
              <rect x="6" y="8" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M6 30l9-9 7 7 8-10 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col gap-5">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase w-fit"
          style={{ background: 'var(--secondary-bg)', color: 'var(--secondary-text)' }}
        >
          Artículo destacado
        </span>

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium">
            {tags.slice(0, 2).map((tag, i) => (
              <span key={tag} className="flex items-center gap-2">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-[var(--border)] inline-block" />}
                {tag}
              </span>
            ))}
            {formattedDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-[var(--border)] inline-block" />
                <time>{formattedDate}</time>
              </>
            )}
          </div>
        )}

        <h2 className="h2-editorial-sm leading-tight group-hover:opacity-70 transition-opacity">
          {title}
        </h2>

        {excerpt && (
          <p className="text-[var(--text)] leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}

        <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-h)] mt-2">
          Leer el ensayo
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
            <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default FeaturedPost;