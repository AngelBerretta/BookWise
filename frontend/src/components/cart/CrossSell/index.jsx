import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '../../../utils/constants';
import ProductCard from '../../product/ProductCard';
import ProductSkeleton from '../../product/ProductSkeleton';
import useCrossSellSuggestions, { SUGGESTIONS_LIMIT } from './useCrossSellSuggestions';

/**
 * "También te puede interesar". No se muestra si el carrito está vacío
 * o si no hay sugerencias válidas para mostrar.
 */
const CrossSell = () => {
  const { category, suggestions, loading, error } = useCrossSellSuggestions();

  if (!category) return null;
  if (error) return null;
  if (!loading && suggestions.length === 0) return null;

  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.value === category)?.label ?? category;

  return (
    // overflow-anchor: none — evita que el navegador reajuste el scroll
    // (Scroll Anchoring + `scroll-behavior: smooth` en <html>) cuando
    // esta sección cambia de tamaño al pasar de skeleton a resultados.
    <section aria-label="Sugerencias" className="mt-10" style={{ overflowAnchor: 'none' }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            También te puede interesar
          </p>
          <h2 className="h2-editorial text-xl sm:text-2xl">
            Más de {categoryLabel}
          </h2>
        </div>
        <Link
          to={`/products?category=${category}`}
          className="text-sm font-medium text-[var(--text-h)] flex items-center gap-1 hover:opacity-60 transition-opacity shrink-0"
        >
          Ver todos
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: SUGGESTIONS_LIMIT }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {suggestions.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  );
};

export default CrossSell;