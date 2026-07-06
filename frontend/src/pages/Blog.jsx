import { Link }      from 'react-router-dom';
import useBlog       from '../hooks/useBlog';
import PostCard      from '../components/blog/PostCard';
import Spinner       from '../components/ui/Spinner';
import EmptyState    from '../components/ui/EmptyState';
import Pagination    from '../components/ui/Pagination';

const Blog = () => {
  const {
    posts, loading, error, search, setSearch,
    page, setPage, totalPages, refetch,
  } = useBlog();

  /* Primer post destacado, el resto en grid */
  const [featured, ...rest] = posts;

  return (
    <div className="bg-[var(--bg)] min-h-screen">

      {/* Header */}
      <div
        className="border-b border-[var(--border-subtle)]"
        style={{ background: 'var(--bg-subtle)' }}
      >
        <div className="container py-16 text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
            Editorial
          </p>
          <h1 className="h1-editorial mb-4">
            El diario del curador
          </h1>
          <p className="text-[var(--text)] text-lg leading-relaxed mb-8">
            Reseñas, recomendaciones y reflexiones literarias desde los rincones de nuestras estanterías.
          </p>

          {/* Buscador */}
          <div className="relative max-w-md mx-auto">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none"
            >
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              type="search"
              placeholder="Buscar artículos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border pl-11 pr-4 py-3 text-sm bg-[var(--bg-lowest)] text-[var(--text-h)] border-[var(--border)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="container py-14">

        {/* Loading */}
        {loading && posts.length === 0 && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <EmptyState
            title="No pudimos cargar el blog"
            description={error}
            action={{ label: 'Reintentar', onClick: () => refetch() }}
          />
        )}

        {/* Sin resultados */}
        {!loading && !error && posts.length === 0 && (
          <EmptyState
            title={search ? 'Sin resultados' : 'Todavía no hay posts'}
            description={
              search
                ? `No encontramos artículos para "${search}".`
                : 'Volvé pronto, estamos preparando contenido.'
            }
            action={search ? { label: 'Limpiar búsqueda', onClick: () => setSearch('') } : undefined}
          />
        )}

        {/* Post destacado */}
        {posts.length > 0 && !search && page === 1 && featured && (
          <div
            className="mb-16"
            style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
          >
            <FeaturedPost post={featured} />
          </div>
        )}

        {/* Grid de posts */}
        {posts.length > 0 && (
          <div
            style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            
            {(search || page > 1 ? posts : rest).map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      </div>
    </div>
  );
};

/* Post destacado — layout asimétrico */
const FeaturedPost = ({ post }) => {
  const { title, content, slug, thumbnail, tags, createdAt } = post;

  const plainText = (content ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const excerpt   = plainText.length <= 200
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
      {/* Imagen */}
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

      {/* Contenido */}
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

export default Blog;