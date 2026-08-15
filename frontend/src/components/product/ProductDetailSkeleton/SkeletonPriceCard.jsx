const SkeletonPriceCard = () => (
  <div
    className="rounded-xl p-5 sm:p-8 mb-8 sm:mb-10"
    style={{
      backgroundColor: 'var(--bg-lowest)',
      border: '1px solid rgba(196,198,205,0.15)',
    }}
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-28 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-3.5 w-36 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-12 w-28 rounded-lg" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-12 w-[200px] rounded-lg" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>
    </div>
  </div>
);

export default SkeletonPriceCard;