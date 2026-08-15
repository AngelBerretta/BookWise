import SkeletonBreadcrumb from './SkeletonBreadcrumb';
import SkeletonCover from './SkeletonCover';
import SkeletonInfoColumn from './SkeletonInfoColumn';

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
      <SkeletonBreadcrumb />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 mb-14 sm:mb-24">
        <SkeletonCover />
        <SkeletonInfoColumn />
      </section>
    </main>
  </div>
);

export default ProductDetailSkeleton;