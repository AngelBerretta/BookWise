const SkeletonBreadcrumb = () => (
  <div
    className="flex items-center gap-3 pb-6 sm:pb-8 mb-6 sm:mb-8"
    style={{ borderBottom: '1px solid rgba(196,198,205,0.15)' }}
  >
    <div className="h-3 w-12 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    <div className="h-3 w-12 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    <div className="h-3 w-32 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
  </div>
);

export default SkeletonBreadcrumb;