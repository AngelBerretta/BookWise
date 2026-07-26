/**
 * Skeleton de PostCard — mismo patrón visual que ProductSkeleton.
 */
const PostCardSkeleton = () => (
  <article className="flex flex-col animate-pulse" aria-hidden="true">

    {/* Imagen */}
    <div
      className="rounded-xl mb-5 w-full"
      style={{ aspectRatio: '16/9', backgroundColor: 'var(--bg-container)' }}
    />

    {/* Meta (categoría · fecha · autor) */}
    <div className="flex items-center gap-2 mb-3">
      <div className="h-2.5 w-14 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-2.5 w-20 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-2.5 w-16 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

    {/* Título — dos líneas */}
    <div className="flex flex-col gap-2 mb-3">
      <div className="h-5 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-5 w-2/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

    {/* Excerpt — tres líneas */}
    <div className="flex flex-col gap-1.5 mb-5">
      <div className="h-3.5 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-3.5 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-3.5 w-1/2 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

    {/* Leer más */}
    <div className="h-3.5 w-20 rounded mt-auto" style={{ backgroundColor: 'var(--bg-container)' }} />

  </article>
);

export default PostCardSkeleton;