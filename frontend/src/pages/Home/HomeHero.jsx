import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import heroImage from '../../assets/hero.png';

const HomeHero = ({ isAuthenticated }) => (
  <section className="border-b border-[var(--border-subtle)]">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center py-14 sm:py-28">
        <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase w-fit"
            style={{ background: 'var(--secondary-bg)', color: 'var(--secondary-text)' }}
          >
            Selección del curador
          </span>

          <h1 className="h1-editorial-hero">
            Tu próxima<br /><em>gran lectura</em>
          </h1>

          <p className="text-lg text-[var(--text)] leading-relaxed max-w-md">
            Ficción, ensayo, ciencia y más. Encontrá tu próximo libro favorito en BookWise, la librería digital del lector exigente.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button variant="primary" size="lg">Ver catálogo</Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="secondary" size="lg">Crear cuenta gratis</Button>
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

        <div className="lg:col-span-7 order-1 lg:order-2 relative">
          <div
            className="absolute inset-0 rounded-xl -z-10"
            style={{ background: 'var(--bg-container)', transform: 'translate(12px, 12px)' }}
          />
          <div
            className="relative w-full overflow-hidden rounded-xl"
            style={{ aspectRatio: '16/10', background: 'var(--bg-subtle)' }}
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
              style={{ background: 'linear-gradient(to top, rgba(4,22,39,0.3) 0%, transparent 60%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HomeHero;