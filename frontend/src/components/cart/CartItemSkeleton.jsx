/**
 * Skeleton de CartItem — replica dimensiones exactas
 * (thumbnail 20×28, controles, subtotal) para evitar salto de layout.
 */
const CartItemSkeleton = () => (
  <div className="flex gap-4 py-5 border-b border-[var(--border)] last:border-b-0 animate-pulse" aria-hidden="true">

    {/* Imagen */}
    <div
      className="shrink-0 w-20 h-28 rounded-xl"
      style={{ backgroundColor: 'var(--bg-container)' }}
    />

    {/* Info + controles */}
    <div className="flex-1 min-w-0 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 w-2/3">
          <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
          <div className="h-3 w-1/3 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        </div>
        <div className="h-4 w-16 rounded shrink-0" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-8 w-28 rounded-lg" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-6 w-16 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="ml-auto h-5 w-20 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>
    </div>
  </div>
);

export default CartItemSkeleton;