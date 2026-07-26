/**
 * Skeleton de PostDetail — mismo patrón visual que ProductSkeleton/PostCardSkeleton.
 */
const PostDetailSkeleton = () => (
  <article className="max-w-3xl mx-auto animate-pulse" aria-hidden="true">

    {/* Imagen hero */}
    <div
      className="w-full aspect-video rounded-2xl mb-8"
      style={{ backgroundColor: 'var(--bg-container)' }}
    />

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="h-5 w-16 rounded-full" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-5 w-20 rounded-full" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

    {/* Título — dos líneas grandes */}
    <div className="flex flex-col gap-3 mb-5">
      <div className="h-9 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-9 w-2/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

    {/* Meta del autor y fechas */}
    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[var(--border)]">
      <div
        className="w-9 h-9 rounded-full shrink-0"
        style={{ backgroundColor: 'var(--bg-container)' }}
      />
      <div className="flex flex-col gap-2">
        <div className="h-3.5 w-28 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-3 w-36 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>
    </div>

    {/* Cuerpo del artículo — líneas de texto simuladas */}
    <div className="flex flex-col gap-3.5">
      <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-11/12 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />

      {/* Espacio de párrafo */}
      <div className="h-2" />

      <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-5/6 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-2/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

  </article>
);

export default PostDetailSkeleton;