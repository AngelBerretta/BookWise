import { useParams, useNavigate } from 'react-router-dom';
import ProductDetailSkeleton from '../../components/product/ProductDetailSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import useProductDetail from './useProductDetail';
import ProductDetailBreadcrumb from './ProductDetailBreadcrumb';
import ProductDetailGallery from './ProductDetailGallery';
import ProductDetailInfo from './ProductDetailInfo';
import ProductDetailMeta from './ProductDetailMeta';
import ProductDetailRelated from './ProductDetailRelated';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    product, loading, error, related,
    adding, quantity, setQuantity, savingWish,
    saved, outOfStock, maxQty,
    handleToggleWishlist, handleAddToCart,
  } = useProductDetail(id);

  if (loading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <EmptyState
          title="Producto no encontrado"
          description={error ?? 'El producto que buscás no existe o fue eliminado.'}
          action={{ label: 'Ver todos los libros', onClick: () => navigate('/products') }}
        />
      </div>
    );
  }

  const { title, author, description, price, stock, category, thumbnails } = product;
  const thumbnail = thumbnails?.[0];

  return (
    <div
      className="antialiased min-h-screen flex flex-col font-body"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', zoom: '98%' }}
    >
      <main className="flex-grow pt-6 sm:pt-8 pb-16 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <ProductDetailBreadcrumb title={title} />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          <ProductDetailGallery title={title} thumbnail={thumbnail} />

          <div className="lg:col-span-7 flex flex-col justify-start pt-4">
            <ProductDetailInfo
              title={title}
              author={author}
              category={category}
              price={price}
              stock={stock}
              outOfStock={outOfStock}
              quantity={quantity}
              setQuantity={setQuantity}
              maxQty={maxQty}
              saved={saved}
              savingWish={savingWish}
              onToggleWishlist={handleToggleWishlist}
              adding={adding}
              onAddToCart={handleAddToCart}
            />

            <ProductDetailMeta
              description={description}
              category={category}
              publicationDate={product.publicationDate}
              pages={product.pages}
              outOfStock={outOfStock}
            />
          </div>
        </section>

        <ProductDetailRelated related={related} />
      </main>
    </div>
  );
};

export default ProductDetail;