import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import ProductSkeleton from '../../components/product/ProductSkeleton';
import { FEATURED_PRODUCTS_LIMIT } from './useHomeData';

const HomeFeaturedProducts = ({ sectionRef, visible, loading, products, error }) => (
  <section
    id="novedades"
    ref={sectionRef}
    className={`py-14 sm:py-20 reveal ${visible ? 'is-visible' : ''}`}
    style={{ background: 'var(--bg-subtle)', scrollMarginTop: 'var(--navbar-h)' }}
  >
    <div className="container">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Novedades
          </p>
          <h2 className="h2-editorial">Nuevas incorporaciones</h2>
        </div>
        <Link
          to="/products"
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
          {Array.from({ length: FEATURED_PRODUCTS_LIMIT }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : error ? (
        <p className="text-center text-[var(--text)] py-12">
          No pudimos cargar los productos. Probá recargar la página.
        </p>
      ) : (
        <p className="text-center text-[var(--text)] py-12">
          Todavía no hay productos disponibles.
        </p>
      )}
    </div>
  </section>
);

export default HomeFeaturedProducts;