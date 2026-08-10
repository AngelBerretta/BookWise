const WishlistItemSkeleton = () => (
  <div className="flex gap-4 py-6 border-b border-[var(--border)] last:border-b-0 animate-pulse" aria-hidden="true">
    <div className="shrink-0 w-24 h-32 sm:w-28 sm:h-40 rounded-xl" style={{ backgroundColor: 'var(--bg-container)' }} />

    <div className="flex-1 min-w-0 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 w-2/3">
          <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
          <div className="h-3 w-1/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        </div>
        <div className="h-8 w-8 rounded-lg shrink-0" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="h-5 w-20 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-8 w-40 rounded-lg" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>
    </div>
  </div>
);

export default WishlistItemSkeleton;