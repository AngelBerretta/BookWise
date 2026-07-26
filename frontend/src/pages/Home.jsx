import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { getProducts }         from '../services/productService';
import { getPosts }            from '../services/blogService';
import useAuth                 from '../hooks/useAuth';
import useToast                from '../hooks/useToast';
import useScrollReveal         from '../hooks/useScrollReveal';
import ProductCard             from '../components/product/ProductCard';
import ProductSkeleton         from '../components/product/ProductSkeleton';
import PostCard                from '../components/blog/PostCard';
import Button                  from '../components/ui/Button';
import PostCardSkeleton        from '../components/blog/PostCardSkeleton';
import Input                   from '../components/ui/Input';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import heroImage                from '../assets/hero.png';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FEATURED_PRODUCTS_LIMIT = 4;
const FEATURED_POSTS_LIMIT    = 3;

/* Ícono de flecha reutilizable para la fila de categoría (mobile y desktop) */
const CategoryArrow = ({ className = '' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`w-3.5 h-3.5 shrink-0 text-[var(--text-muted)] opacity-0 -translate-x-1
               group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${className}`}
    aria-hidden="true"
  >
    <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { showToast }       = useToast();

  const [products, setProducts]     = useState([]);
  const [posts, setPosts]           = useState([]);
  const [loadingP, setLoadingP]     = useState(true);
  const [loadingB, setLoadingB]     = useState(true);
  const [errorP, setErrorP]         = useState(false);
  const [errorB, setErrorB]         = useState(false);
  const [totalBooks, setTotalBooks] = useState(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing]         = useState(false);

  const [categoriesRef, categoriesVisible] = useScrollReveal();
  const [productsRef, productsVisible]     = useScrollReveal();
  const [blogRef, blogVisible]             = useScrollReveal();
  const [statsRef, statsVisible]           = useScrollReveal();
  const [ctaRef, ctaVisible]               = useScrollReveal();
  const [newsletterRef, newsletterVisible] = useScrollReveal();

  useEffect(() => {
    getProducts({ limit: FEATURED_PRODUCTS_LIMIT })
      .then((d) => {
        setProducts(Array.isArray(d) ? d : (d.payload ?? []));
        setTotalBooks(Array.isArray(d) ? null : (d.totalDocs ?? null));
      })
      .catch(() => setErrorP(true))
      .finally(() => setLoadingP(false));
  }, []);

  useEffect(() => {
    getPosts({ limit: FEATURED_POSTS_LIMIT })
      .then((d) => {
        const arr = Array.isArray(d) ? d : (d.payload ?? []);
        setPosts(arr.slice(0, FEATURED_POSTS_LIMIT));
      })
      .catch(() => setErrorB(true))
      .finally(() => setLoadingB(false));
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = newsletterEmail.trim();

    if (!EMAIL_RE.test(email)) {
      showToast({ type: 'warning', message: 'Ingresá un correo electrónico válido.' });
      return;
    }

    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setNewsletterEmail('');
      showToast({ type: 'success', message: '¡Listo! Te vamos a avisar de las novedades por correo.' });
    }, 500);
  };

  const stats = [
    {
      value: loadingP || totalBooks === null ? null : totalBooks,
      label: 'Libros en catálogo',
    },
    {
      value: PRODUCT_CATEGORIES.length,
      label: 'Categorías para explorar',
    },
    {
      value: '+200',
      label: 'Lectores en la comunidad',
    },
  ];

  return (
    <div className="bg-[var(--bg)]">

      {/* ── Hero ── */}
      <section className="border-b border-[var(--border-subtle)]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center py-14 sm:py-28">

            {/* Texto */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase w-fit"
                style={{
                  background: 'var(--secondary-bg)',
                  color: 'var(--secondary-text)',
                }}
              >
                Selección del curador
              </span>

              <h1 className="h1-editorial-hero">
                Tu próxima<br />
                <em>gran lectura</em>
              </h1>

              <p className="text-lg text-[var(--text)] leading-relaxed max-w-md">
                Ficción, ensayo, ciencia y más. Encontrá tu próximo libro favorito en BookWise, la librería digital del lector exigente.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                <div className="flex flex-wrap gap-3">
                  <Link to="/products">
                    <Button variant="primary" size="lg">
                      Ver catálogo
                    </Button>
                  </Link>
                  {!isAuthenticated && (
                    <Link to="/register">
                      <Button variant="secondary" size="lg">
                        Crear cuenta gratis
                      </Button>
                    </Link>
                  )}
                </div>

                <a
                  href="#novedades"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-h)] w-fit hover:opacity-60 transition-opacity"
                >
                  Ver novedades
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Imagen hero */}
            <div className="lg:col-span-7 order-1 lg:order-2 relative">
              <div
                className="absolute inset-0 rounded-xl -z-10"
                style={{
                  background: 'var(--bg-container)',
                  transform: 'translate(12px, 12px)',
                }}
              />
              <div
                className="relative w-full overflow-hidden rounded-xl"
                style={{
                  aspectRatio: '16/10',
                  background: 'var(--bg-subtle)',
                }}
              >
                <img
                  src={heroImage}
                  alt="Biblioteca BookWise"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(4,22,39,0.3) 0%, transparent 60%)',
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Categorías ── */}
      <section
        ref={categoriesRef}
        className={`container py-14 sm:py-20 reveal ${categoriesVisible ? 'is-visible' : ''}`}
      >
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Explorá
          </p>
          <h2 className="h2-editorial">
            Categorías
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-[var(--border-subtle)]">
          {PRODUCT_CATEGORIES.map((cat, i) => {
            const number = String(i + 1).padStart(2, '0');
            return (
              <Link
                key={cat.value}
                to={`/products?category=${cat.value}`}
                className={`group relative border-r border-b border-[var(--border-subtle)]
                            transition-colors duration-300 hover:bg-[var(--bg-subtle)]
                            reveal ${categoriesVisible ? 'is-visible' : ''}`}
                style={{ transitionDelay: categoriesVisible ? `${i * 60}ms` : '0ms' }}
              >
                {/* Mobile — fila tipo índice: número · label · flecha, ancho completo */}
                <div className="flex sm:hidden items-center gap-4 px-5 py-4">
                  <span
                    className="text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-300 shrink-0"
                    style={{ fontFamily: 'var(--heading)', fontWeight: 400, fontSize: '1.5rem' }}
                  >
                    {number}
                  </span>
                  <span className="flex-1 text-sm font-medium text-[var(--text-h)]">
                    {cat.label}
                  </span>
                  <CategoryArrow />
                </div>

                {/* Tablet/desktop — celda tipo tarjeta, número arriba, label abajo */}
                <div className="hidden sm:flex flex-col justify-between gap-10 md:gap-14 p-6 md:p-7 h-full">
                  <span
                    className="text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-300"
                    style={{ fontFamily: 'var(--heading)', fontWeight: 400, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
                  >
                    {number}
                  </span>
                  <span className="flex items-end justify-between gap-2">
                    <span className="text-[0.95rem] font-medium text-[var(--text-h)] leading-snug">
                      {cat.label}
                    </span>
                    <CategoryArrow />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Divisor ── */}
      <div className="border-t border-[var(--border-subtle)]" role="presentation" aria-hidden="true" />

      {/* ── Productos destacados ── */}
      <section
        id="novedades"
        ref={productsRef}
        className={`py-14 sm:py-20 reveal ${productsVisible ? 'is-visible' : ''}`}
        style={{ background: 'var(--bg-subtle)', scrollMarginTop: 'var(--navbar-h)' }}
      >
        <div className="container">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Novedades
              </p>
              <h2 className="h2-editorial">
                Nuevas incorporaciones
              </h2>
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

          {loadingP ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: FEATURED_PRODUCTS_LIMIT }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : errorP ? (
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

      {/* ── Divisor ── */}
      <div className="border-t border-[var(--border-subtle)]" role="presentation" aria-hidden="true" />

      {/* ── Blog ── */}
      <section
        ref={blogRef}
        className={`py-14 sm:py-20 reveal ${blogVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Editorial
              </p>
              <h2 className="h2-editorial">
                Del diario del curador
              </h2>
            </div>
            <Link
              to="/blog"
              className="text-sm font-medium text-[var(--text-h)] flex items-center gap-1 hover:opacity-60 transition-opacity shrink-0"
            >
              Ver todo
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {loadingB ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: FEATURED_POSTS_LIMIT }).map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          ) : errorB ? (
          <p className="text-center text-[var(--text)] py-12">
            No pudimos cargar los artículos. Probá recargar la página.
          </p>
          ) : (
            <p className="text-center text-[var(--text)] py-12">
              Todavía no hay artículos publicados.
            </p>
          )}
        </div>
      </section>

      {/* ── Estadísticas ── */}
      <section
        ref={statsRef}
        className={`py-14 sm:py-16 reveal ${statsVisible ? 'is-visible' : ''}`}
        style={{ background: 'var(--bg-subtle)' }}
      >
        <div className="container grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center gap-1 reveal ${statsVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: statsVisible ? `${i * 90}ms` : '0ms' }}
            >
              <span
                className="text-[var(--text-h)]"
                style={{ fontFamily: 'var(--heading)', fontWeight: 500, fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
              >
                {s.value === null
                  ? <span className="inline-block h-9 w-14 rounded-md bg-[var(--bg-container)] animate-pulse align-middle" />
                  : s.value}
              </span>
              <span className="text-sm text-[var(--text)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      {!isAuthenticated && (
        <section
          ref={ctaRef}
          className={`border-t border-[var(--border-subtle)] reveal ${ctaVisible ? 'is-visible' : ''}`}
        >
          <div className="container py-16 sm:py-24 flex flex-col items-center text-center gap-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Comenzá hoy
            </p>
            <h2 className="h2-editorial max-w-md">
              El lector que querés ser empieza aquí
            </h2>
            <p className="text-[var(--text)] max-w-sm leading-relaxed">
              Creá tu cuenta gratis y accedé a nuestro catálogo completo de libros y reseñas.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg">
                Registrarse gratis
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* ── Newsletter ── */}
      <section
        ref={newsletterRef}
        className={`border-t border-[var(--border-subtle)] reveal ${newsletterVisible ? 'is-visible' : ''}`}
        style={{ background: 'var(--bg-subtle)' }}
      >
        <div className="container py-16 sm:py-24">
          <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Newsletter
            </p>
            <h2 className="h2-editorial">
              Novedades directo en tu correo
            </h2>
            <p className="text-[var(--text)] max-w-sm leading-relaxed">
              Recibí una selección mensual de lanzamientos, reseñas y recomendaciones del curador. Sin spam.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full flex flex-col sm:flex-row gap-3 max-w-md"
              noValidate
            >
              <Input
                type="email"
                placeholder="tu@email.com"
                aria-label="Correo electrónico"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 text-left"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={subscribing}
                className="shrink-0"
              >
                Suscribirme
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;