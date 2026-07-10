import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { getProducts }         from '../services/productService';
import { getPosts }            from '../services/blogService';
import { useAuth }             from '../context/AuthContext';
import ProductCard             from '../components/product/ProductCard';
import PostCard                from '../components/blog/PostCard';
import Button                  from '../components/ui/Button';
import Spinner                 from '../components/ui/Spinner';
import heroImage                from '../assets/hero.png';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [posts, setPosts]       = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingB, setLoadingB] = useState(true);
  const [errorP, setErrorP]     = useState(false);
  const [errorB, setErrorB]     = useState(false);

  useEffect(() => {
    getProducts({ limit: 4 })
      .then((d) => setProducts(Array.isArray(d) ? d : (d.payload ?? [])))
      .catch(() => setErrorP(true))
      .finally(() => setLoadingP(false));
  }, []);

  useEffect(() => {
    getPosts({ limit: 3 })
      .then((d) => {
        const arr = Array.isArray(d) ? d : (d.payload ?? []);
        setPosts(arr.slice(0, 3)); // el backend ya filtra published=true para no-admins
      })
      .catch(() => setErrorB(true))
      .finally(() => setLoadingB(false));
  }, []);

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

              <div className="flex flex-wrap gap-3 pt-2">
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
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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

      {/* ── Productos destacados ── */}
      <section className="container py-14 sm:py-20">
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
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
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
      </section>

      {/* ── Divisor ── */}
      <div className="border-t border-[var(--border-subtle)]" />

      {/* ── Blog ── */}
      <section
        className="py-14 sm:py-20"
        style={{ background: 'var(--bg-subtle)' }}
      >
        <div className="container">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Editorial
              </p>
              <h2
                className="text-[var(--text-h)]"
                style={{ fontFamily: 'var(--heading)', fontWeight: 500 }}
              >
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
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
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

      {/* ── CTA final ── */}
      {!isAuthenticated && (
        <section className="border-t border-[var(--border-subtle)]">
          <div className="container py-16 sm:py-24 flex flex-col items-center text-center gap-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Comenzá hoy
            </p>
            <h2
              className="h2-editorial max-w-md"
              style={{ fontFamily: 'var(--heading)', fontWeight: 500 }}
            >
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

    </div>
  );
};

export default Home;