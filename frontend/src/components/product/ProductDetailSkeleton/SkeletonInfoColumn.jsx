import SkeletonPriceCard from './SkeletonPriceCard';

const SkeletonInfoColumn = () => (
  <div className="lg:col-span-7 flex flex-col justify-start pt-4">

    {/* Badge + autor */}
    <div className="flex items-center gap-3 mb-6">
      <div className="h-6 w-24 rounded-full" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

    {/* Título */}
    <div className="flex flex-col gap-2 mb-4">
      <div className="h-9 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-9 w-2/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

    {/* "por Autor" */}
    <div className="h-5 w-40 rounded mb-8" style={{ backgroundColor: 'var(--bg-container)' }} />

    <SkeletonPriceCard />

    {/* Descripción */}
    <div className="flex flex-col gap-2.5 mb-12">
      <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>

    {/* Grid de detalles */}
    <div
      className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8"
      style={{ borderTop: '1px solid rgba(196,198,205,0.15)' }}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-2.5 w-16 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
          <div className="h-3.5 w-20 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonInfoColumn;