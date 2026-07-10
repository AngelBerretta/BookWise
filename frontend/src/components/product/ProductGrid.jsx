import ProductCard     from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import EmptyState      from '../ui/EmptyState';

/**
 * Grid responsivo de productos — estilo BookWise.
 * Lógica idéntica al original.
 */
const ProductGrid = ({ products, loading, error, onClearFilters }) => {

  /* ── Error ── */
  if (error) {
    return (
      <EmptyState
        title="No pudimos cargar los productos"
        description={error}
        action={
          onClearFilters
            ? { label: 'Reintentar', onClick: onClearFilters }
            : undefined
        }
      />
    );
  }

  /* ── Cualquier carga (inicial, cambio de filtro o página) → skeletons ── */
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  /* ── Sin resultados ── */
  if (!products.length && !loading) {
    return (
      <EmptyState
        title="No encontramos productos"
        description="Probá con otra búsqueda o categoría."
        action={
          onClearFilters
            ? {
                label: 'Ver todos los productos',
                onClick: onClearFilters,
                variant: 'secondary',
              }
            : undefined
        }
      />
    );
  }

  /* ── Grid ── */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;