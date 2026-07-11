import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import Toast from '../components/ui/Toast';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatPrice } from '../utils/formatPrice';
import { PRODUCT_CATEGORIES } from '../utils/constants';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [adding, setAdding]     = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast]       = useState(null);
  const [saved, setSaved]       = useState(false);

  /* ── Fetch ── */
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data.product ?? data);
      } catch (err) {
        setError(
          err?.message ||
          err?.response?.data?.message ||
          'No pudimos cargar el producto.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ── Add to cart ── */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setToast({ type: 'warning', message: 'Iniciá sesión para agregar al carrito.' });
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      setToast({ type: 'success', message: `"${product.title}" agregado al carrito.` });
    } catch {
      setToast({ type: 'error', message: 'No pudimos agregar el producto. Intentá de nuevo.' });
    } finally {
      setAdding(false);
    }
  };

  const fmt = (n) => formatPrice(n, false);

  /* ── Estados UI ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor: 'var(--bg)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor: 'var(--bg)' }}>
        <EmptyState
          title="Producto no encontrado"
          description={error ?? 'El producto que buscás no existe o fue eliminado.'}
          action={{ label: 'Ver todos los libros', onClick: () => navigate('/products') }}
        />
      </div>
    );
  }

  const { title, author, description, price, stock, category, thumbnails } = product;
  const outOfStock = stock === 0;
  const maxQty     = Math.min(stock, 10);
  const thumbnail  = thumbnails?.[0];

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="antialiased min-h-screen flex flex-col font-body"
           style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>

        {/* ── Main ── */}
        <main className="flex-grow pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">

          {/* ── Breadcrumb ── */}
          <div
            className="flex items-center gap-2 text-xs pb-6 sm:pb-8 mb-6 sm:mb-8"
            style={{
              borderBottom: '1px solid rgba(196,198,205,0.15)',
              color: 'var(--text-muted)',
            }}
          >
            <Link
              to="/"
              className="transition-colors hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
            >
              Inicio
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="transition-colors hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
            >
              Libros
            </Link>
            <span>/</span>
            <span
              className="line-clamp-1"
              style={{ color: 'var(--text)' }}
            >
              {title}
            </span>
          </div>

          {/* ── Product grid ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 mb-14 sm:mb-24">

            {/* ── Columna imagen ── */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-32">
                <div
                  className="relative rounded-xl p-5 sm:p-8 flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--bg-container)',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={`Portada de ${title}`}
                      className="w-full max-w-xs rounded-lg z-10 transition-transform duration-500 hover:-translate-y-2"
                      style={{ boxShadow: 'var(--shadow-lg)' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    /* Placeholder libro */
                    <div
                      className="w-full max-w-xs rounded-lg z-10 flex flex-col items-center justify-center gap-4 py-16"
                      style={{
                        aspectRatio: '3/4',
                        backgroundColor: 'var(--bg-subtle)',
                        boxShadow: 'var(--shadow-lg)',
                      }}
                    >
                      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20"
                           style={{ color: 'var(--border)' }}>
                        <rect x="8"  y="6"  width="36" height="52" rx="4"
                              stroke="currentColor" strokeWidth="2.5" />
                        <rect x="18" y="6"  width="38" height="52" rx="4"
                              stroke="currentColor" strokeWidth="2.5"
                              fill="var(--bg-subtle)" />
                        <line x1="26" y1="20" x2="48" y2="20"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="26" y1="27" x2="48" y2="27"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="26" y1="34" x2="38" y2="34"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="text-sm text-center px-4"
                            style={{ color: 'var(--text)', opacity: 0.6 }}>
                        {title}
                      </span>
                    </div>
                  )}

                  {/* Capa decorativa trasera */}
                  <div
                    className="absolute inset-4 rounded-xl -z-10 translate-x-2 translate-y-2 opacity-50"
                    style={{ backgroundColor: 'var(--bg-lowest)' }}
                  />
                </div>
              </div>
            </div>

            {/* ── Columna info ── */}
            <div className="lg:col-span-7 flex flex-col justify-start pt-4">

              {/* Tags / categoría */}
              <div className="flex items-center gap-3 mb-6 text-sm flex-wrap"
                   style={{ color: 'var(--text)' }}>
                {category && (
                  <Badge category={category} />
                )}
                {author && (
                  <>
                    <span style={{ color: 'var(--border)' }}>•</span>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>
                      {author}
                    </span>
                  </>
                )}
              </div>

              {/* Título */}
              <h1 className="h1-editorial mb-4">
                {title}
              </h1>

              {/* Autor */}
              {author && (
                <p
                  className="text-xl font-headline italic mb-8"
                  style={{ color: 'var(--text)' }}
                >
                  por {author}
                </p>
              )}

              {/* ── Card precio + acciones ── */}
              <div
                className="rounded-xl p-5 sm:p-8 mb-8 sm:mb-10 relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-lowest)',
                  border: '1px solid rgba(196,198,205,0.15)',
                  boxShadow: 'var(--shadow)',
                }}
              >
                {/* Gradiente decorativo */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at top right, color-mix(in srgb, var(--bg-subtle) 50%, transparent), transparent)',
                  }}
                />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Precio + stock */}
                  <div>
                    <p
                      className="font-headline text-3xl"
                      style={{ color: 'var(--text-h)' }}
                    >
                      {fmt(price)}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: 'var(--text)' }}
                    >
                      {outOfStock
                        ? 'Sin stock disponible'
                        : `${stock} ${stock === 1 ? 'unidad disponible' : 'unidades disponibles'}`}
                    </p>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center gap-3 flex-wrap">

                    {/* Selector cantidad */}
                    {!outOfStock && (
                      <div
                        className="flex items-center rounded-lg overflow-hidden shrink-0"
                        style={{ border: '1px solid var(--border)' }}>
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          className="px-3 py-3 transition-colors disabled:opacity-40"
                          style={{ color: 'var(--text)' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-container)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          −
                        </button>
                        <span
                          className="px-4 py-3 text-sm font-medium min-w-[3rem] text-center"
                          style={{
                            color: 'var(--text-h)',
                            borderLeft: '1px solid var(--border)',
                            borderRight: '1px solid var(--border)',
                          }}
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                          disabled={quantity >= maxQty}
                          className="px-3 py-3 transition-colors disabled:opacity-40"
                          style={{ color: 'var(--text)' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-container)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Guardar / bookmark — único, ubicado antes del CTA */}
                    <button
                      onClick={() => setSaved(s => !s)}
                      className="px-4 py-4 rounded-lg transition-colors duration-300 shrink-0"
                      style={{
                        border: '1px solid rgba(196,198,205,0.5)',
                        color: saved ? 'var(--accent)' : 'var(--text)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-container)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      aria-label={saved ? 'Quitar de guardados' : 'Guardar'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        {saved ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>

                    {/* Botón agregar / sin stock */}
                    {!outOfStock ? (
                      <Button
                        variant="primary"
                        size="lg"
                        loading={adding}
                        onClick={handleAddToCart}
                        className="flex-1 justify-center min-w-[200px]"
                      >
                        {!adding && (
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            shopping_bag
                          </span>
                        )}
                        {adding ? 'Agregando…' : 'Agregar al carrito'}
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="lg"
                        disabled
                        className="flex-1 justify-center min-w-[200px]"
                      >
                        Sin stock
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {description && (
                <div
                  className="mb-12 leading-relaxed text-base"
                  style={{ color: 'var(--text)' }}
                >
                  <p>{description}</p>
                </div>
              )}

              {/* ── Grid de detalles ── */}
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8"
                style={{ borderTop: '1px solid rgba(196,198,205,0.15)' }}
              >
                {category && (
                  <DetailItem label="Categoría" value={PRODUCT_CATEGORIES.find(c => c.value === category)?.label ?? category}/>
                )}
                {product.publicationDate && (
                  <DetailItem label="Publicación" value={product.publicationDate} />
                )}
                {product.pages && (
                  <DetailItem label="Páginas" value={`${product.pages} págs.`} />
                )}
                {/* Stock como fallback si no hay publication/pages */}
                {!product.publicationDate && !product.pages && (
                  <DetailItem
                    label="Disponibilidad"
                    value={outOfStock ? 'Sin stock' : 'En stock'}
                  />
                )}
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
};

/* ── Subcomponente detalle ── */
const DetailItem = ({ label, value }) => (
  <div>
    <p
      className="text-xs uppercase tracking-widest mb-1"
      style={{ color: 'var(--text)', letterSpacing: '0.1em' }}
    >
      {label}
    </p>
    <p
      className="text-sm font-medium"
      style={{ color: 'var(--text-h)' }}
    >
      {value}
    </p>
  </div>
);

export default ProductDetail;