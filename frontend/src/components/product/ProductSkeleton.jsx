/**
 * Skeleton de ProductCard — estilo BookWise.
 */
const ProductSkeleton = () => (
  <article className="flex flex-col gap-4 animate-pulse" aria-hidden="true">

    {/* Portada */}
    <div
      className="rounded-lg aspect-[3/4] w-full"
      style={{ backgroundColor: 'var(--bg-container)' }}
    />

    {/* Info — mismos altos fijos que ProductCard real (ver ese archivo):
        así el skeleton mide EXACTO lo mismo que la card final y no hay
        salto de altura al reemplazar uno por otro. */}
    <div className="flex flex-col gap-1 px-1">

      {/* Categoría — altura fija h-5, igual que la fila real */}
      <div className="h-5 flex items-center">
        <div
          className="h-2.5 w-16 rounded"
          style={{ backgroundColor: 'var(--bg-container)' }}
        />
      </div>

      {/* Título — dos líneas, min-h-[3.125rem] igual que el real */}
      <div className="min-h-[3.125rem] flex flex-col justify-center gap-1.5">
        <div
          className="h-5 w-full rounded"
          style={{ backgroundColor: 'var(--bg-container)' }}
        />
        <div
          className="h-5 w-3/4 rounded"
          style={{ backgroundColor: 'var(--bg-container)' }}
        />
      </div>

      {/* Autor — altura fija h-5 (antes h-3.5, ahora igual al real) */}
      <div className="h-5 flex items-center">
        <div
          className="h-3.5 w-1/2 rounded"
          style={{ backgroundColor: 'var(--bg-container)' }}
        />
      </div>

      {/* Precio + botón */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2">
        <div
          className="h-4 w-1/4 rounded"
          style={{ backgroundColor: 'var(--bg-container)' }}
        />
        <div
          className="h-7 w-24 rounded-sm"
          style={{ backgroundColor: 'var(--bg-container)' }}
        />
      </div>

    </div>
  </article>
);

export default ProductSkeleton;