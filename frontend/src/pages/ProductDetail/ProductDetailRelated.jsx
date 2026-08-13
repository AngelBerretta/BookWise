import ProductCard from '../../components/product/ProductCard';

const ProductDetailRelated = ({ related }) => {
  if (!related.length) return null;
  return (
    <section className="mt-8 sm:mt-10 pt-6 sm:pt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <h2 className="h2-editorial-sm mb-6">También te puede interesar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {related.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
};

export default ProductDetailRelated;