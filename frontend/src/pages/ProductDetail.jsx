import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import Toast from '../components/ui/Toast';
import EmptyState from '../components/ui/EmptyState';

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

  const fmt = (n) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(n);

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
           style={{ backgroundColor: 'var(--bg)', color: 'var(--bw-on-surface)' }}>

        {/* ── Main ── */}
        <main className="flex-grow pt-32 pb-24 px-8 max-w-7xl mx-auto w-full">

          {/* ── Product grid ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">

            {/* ── Columna imagen ── */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-32">
                <div
                  className="relative rounded-xl p-8 flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--bg-container)',
                    boxShadow: '0 12px 40px rgba(27,28,25,0.06)',
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
                   style={{ color: 'var(--bw-on-surface-variant)' }}>
                {category && (
                  <span
                    className="px-3 py-1 rounded-full font-medium text-xs"
                    style={{
                      backgroundColor: 'var(--secondary-bg)',
                      color: 'var(--secondary-text)',
                    }}
                  >
                    {category}
                  </span>
                )}
                {author && (
                  <>
                    <span style={{ color: 'var(--border)' }}>•</span>
                    <span className="text-sm" style={{ color: 'var(--bw-on-surface-variant)' }}>
                      {author}
                    </span>
                  </>
                )}
              </div>

              {/* Título */}
              <h1
                className="font-headline tracking-tight mb-4 leading-tight"
                style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                  color: 'var(--bw-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h1>

              {/* Autor */}
              {author && (
                <p
                  className="text-xl font-headline italic mb-8"
                  style={{ color: 'var(--bw-on-surface-variant)' }}
                >
                  by {author}
                </p>
              )}

              {/* ── Card precio + acciones ── */}
              <div
                className="rounded-xl p-8 mb-10 relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-lowest)',
                  border: '1px solid rgba(196,198,205,0.15)',
                  boxShadow: '0 4px 20px rgba(4,22,39,0.05)',
                }}
              >
                {/* Gradiente decorativo */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at top right, rgba(245,243,238,0.5), transparent)',
                  }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Precio + stock */}
                  <div>
                    <p
                      className="font-headline text-3xl"
                      style={{ color: 'var(--bw-primary)' }}
                    >
                      {fmt(price)}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: 'var(--bw-on-surface-variant)' }}
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
                        className="flex items-center rounded-lg overflow-hidden"
                        style={{ border: '1px solid var(--border)' }}
                      >
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
                            color: 'var(--bw-primary)',
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

                    {/* Botón agregar / sin stock */}
                    {!outOfStock ? (
                      <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="flex items-center gap-2 px-8 py-4 rounded-lg font-medium
                                   text-sm tracking-wide transition-all duration-300 disabled:opacity-60"
                        style={{
                          backgroundColor: 'var(--bw-primary)',
                          color: '#ffffff',
                          boxShadow: '0 2px 8px rgba(4,22,39,0.25)',
                        }}
                        onMouseEnter={e => {
                          if (!adding) e.currentTarget.style.backgroundColor = 'var(--bw-primary-container)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'var(--bw-primary)';
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                          {adding ? 'hourglass_empty' : 'shopping_bag'}
                        </span>
                        {adding ? 'Agregando…' : 'Agregar al carrito'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-8 py-4 rounded-lg font-medium text-sm tracking-wide opacity-50 cursor-not-allowed"
                        style={{
                          border: '1px solid var(--border)',
                          color: 'var(--bw-primary)',
                        }}
                      >
                        Sin stock
                      </button>
                    )}

                    {/* Guardar / bookmark */}
                    <button
                      onClick={() => setSaved(s => !s)}
                      className="px-4 py-4 rounded-lg transition-colors duration-300"
                      style={{
                        border: '1px solid rgba(196,198,205,0.5)',
                        color: saved ? 'var(--bw-primary)' : 'var(--bw-on-surface-variant)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-container)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      aria-label={saved ? 'Quitar de guardados' : 'Guardar'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        {saved ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {description && (
                <div
                  className="mb-12 leading-relaxed text-base"
                  style={{ color: 'var(--bw-on-surface)' }}
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
                  <DetailItem label="Categoría" value={category} />
                )}
                {product.publicationDate && (
                  <DetailItem label="Publication" value={product.publicationDate} />
                )}
                {product.pages && (
                  <DetailItem label="Pages" value={`${product.pages} págs.`} />
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

          {/* ── Breadcrumb (abajo, estilo sutil) ── */}
          <div
            className="flex items-center gap-2 text-xs pt-8"
            style={{
              borderTop: '1px solid rgba(196,198,205,0.15)',
              color: 'var(--bw-outline)',
            }}
          >
            <Link
              to="/"
              className="transition-colors hover:opacity-70"
              style={{ color: 'var(--bw-outline)' }}
            >
              Inicio
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="transition-colors hover:opacity-70"
              style={{ color: 'var(--bw-outline)' }}
            >
              Libros
            </Link>
            <span>/</span>
            <span
              className="line-clamp-1"
              style={{ color: 'var(--bw-on-surface-variant)' }}
            >
              {title}
            </span>
          </div>

        </main>

        {/* ── Footer ── */}
        <footer className="w-full mt-24 py-16 px-8"
                style={{ backgroundColor: 'var(--bw-primary)', color: '#fbf9f4' }}>
          <div className="max-w-7xl mx-auto">
            <div
              className="flex justify-between items-center mb-8 pb-8 flex-wrap gap-4"
              style={{ borderBottom: '1px solid rgba(251,249,244,0.2)' }}
            >
              <span
                className="text-xl font-headline"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                BookWise
              </span>
              <span className="text-sm opacity-80">
                © {new Date().getFullYear()} BookWise. Todos los derechos reservados.
              </span>
            </div>
            <div className="flex flex-wrap gap-8 text-sm">
              {['Catálogo', 'Política de envíos', 'Contacto'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="transition-opacity"
                  style={{ color: 'rgba(251,249,244,0.65)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fbf9f4'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(251,249,244,0.65)'}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

/* ── Subcomponente detalle ── */
const DetailItem = ({ label, value }) => (
  <div>
    <p
      className="text-xs uppercase tracking-widest mb-1"
      style={{ color: 'var(--bw-on-surface-variant)', letterSpacing: '0.1em' }}
    >
      {label}
    </p>
    <p
      className="text-sm font-medium"
      style={{ color: 'var(--bw-primary)' }}
    >
      {value}
    </p>
  </div>
);

export default ProductDetail;