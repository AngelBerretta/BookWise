/**
 * Skeleton de ProductCard — estilo BookWise.
 */
const ProductSkeleton = () => (
  <article className="flex flex-col gap-4 animate-pulse" aria-hidden="true">

    {/* Portada */}
    <div
      className="rounded-lg aspect-[3/4] w-full"
      style={{ backgroundColor: 'var(--bw-surface-container-high, #eae8e3)' }}
    />

    {/* Info */}
    <div className="flex flex-col gap-2 px-1">

      {/* Categoría */}
      <div
        className="h-2.5 w-16 rounded"
        style={{ backgroundColor: 'var(--bw-surface-container-high)' }}
      />

      {/* Título — dos líneas */}
      <div className="flex flex-col gap-1.5">
        <div
          className="h-5 w-full rounded"
          style={{ backgroundColor: 'var(--bw-surface-container-high)' }}
        />
        <div
          className="h-5 w-3/4 rounded"
          style={{ backgroundColor: 'var(--bw-surface-container-high)' }}
        />
      </div>

      {/* Autor */}
      <div
        className="h-3.5 w-1/2 rounded"
        style={{ backgroundColor: 'var(--bw-surface-container-high)' }}
      />

      {/* Precio + botón */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <div
          className="h-4 w-1/4 rounded"
          style={{ backgroundColor: 'var(--bw-surface-container-high)' }}
        />
        <div
          className="h-7 w-24 rounded-sm"
          style={{ backgroundColor: 'var(--bw-surface-container-high)' }}
        />
      </div>

    </div>
  </article>
);

export default ProductSkeleton;