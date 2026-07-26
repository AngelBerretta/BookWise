/**
 * Skeleton del post destacado — mismo layout asimétrico que FeaturedPost.
 */
const FeaturedPostSkeleton = () => (
  <div
    className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center rounded-xl overflow-hidden border border-[var(--border-subtle)] animate-pulse"
    style={{ background: 'var(--bg-subtle)' }}
    aria-hidden="true"
  >
    {/* Imagen */}
    <div
      className="lg:col-span-7 h-64 lg:h-[440px] w-full"
      style={{ backgroundColor: 'var(--bg-container)' }}
    />

    {/* Contenido */}
    <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col gap-5">
      <div className="h-6 w-40 rounded-full" style={{ backgroundColor: 'var(--bg-container)' }} />

      <div className="flex gap-3">
        <div className="h-2.5 w-16 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-2.5 w-24 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-7 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-7 w-3/4 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-4 w-2/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>

      <div className="h-4 w-32 rounded mt-2" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>
  </div>
);

export default FeaturedPostSkeleton;