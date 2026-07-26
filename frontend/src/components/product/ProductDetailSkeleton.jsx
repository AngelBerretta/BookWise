/**
 * Skeleton de ProductDetail — mismo patrón visual que ProductSkeleton/PostDetailSkeleton.
 * Reproduce la estructura: breadcrumb, imagen, info (badge/autor, título,
 * card de precio+acciones, descripción, grid de detalles).
 */
const ProductDetailSkeleton = () => (
  <div
    className="antialiased min-h-screen flex flex-col font-body animate-pulse"
    style={{ backgroundColor: 'var(--bg)' }}
    aria-hidden="true"
  >
    <main className="flex-grow pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">

      {/* Breadcrumb */}
      <div
        className="flex items-center gap-3 pb-6 sm:pb-8 mb-6 sm:mb-8"
        style={{ borderBottom: '1px solid rgba(196,198,205,0.15)' }}
      >
        <div className="h-3 w-12 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-3 w-12 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-3 w-32 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 mb-14 sm:mb-24">

        {/* Columna imagen */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-32">
            <div
              className="rounded-xl p-5 sm:p-8 flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-container)' }}
            >
              <div
                className="w-full max-w-xs rounded-lg"
                style={{ aspectRatio: '3/4', backgroundColor: 'var(--bg-subtle)' }}
              />
            </div>
          </div>
        </div>

        {/* Columna info */}
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

          {/* Card precio + acciones */}
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
      </section>
    </main>
  </div>
);

export default ProductDetailSkeleton;