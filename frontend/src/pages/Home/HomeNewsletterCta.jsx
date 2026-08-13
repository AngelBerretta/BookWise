import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const HomeNewsletterCta = ({
  isAuthenticated, ctaRef, ctaVisible, newsletterRef, newsletterVisible,
  newsletterEmail, setNewsletterEmail, subscribing, onSubmit,
}) => (
  <>
    {!isAuthenticated && (
      <section ref={ctaRef} className={`border-t border-[var(--border-subtle)] reveal ${ctaVisible ? 'is-visible' : ''}`}>
        <div className="container py-16 sm:py-24 flex flex-col items-center text-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Comenzá hoy
          </p>
          <h2 className="h2-editorial max-w-md">El lector que querés ser empieza aquí</h2>
          <p className="text-[var(--text)] max-w-sm leading-relaxed">
            Creá tu cuenta gratis y accedé a nuestro catálogo completo de libros y reseñas.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg">Registrarse gratis</Button>
          </Link>
        </div>
      </section>
    )}

    <section
      ref={newsletterRef}
      className={`border-t border-[var(--border-subtle)] reveal ${newsletterVisible ? 'is-visible' : ''}`}
      style={{ background: isAuthenticated ? 'var(--bg-lowest)' : 'var(--bg-subtle)' }}
    >
      <div className="container py-16 sm:py-24">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Newsletter
          </p>
          <h2 className="h2-editorial">Novedades directo en tu correo</h2>
          <p className="text-[var(--text)] max-w-sm leading-relaxed">
            Recibí una selección mensual de lanzamientos, reseñas y recomendaciones del curador. Sin spam.
          </p>
          <form onSubmit={onSubmit} className="w-full flex flex-col sm:flex-row gap-3 max-w-md" noValidate>
            <Input
              type="email"
              placeholder="tu@email.com"
              aria-label="Correo electrónico"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 text-left"
              required
            />
            <Button type="submit" variant="primary" size="lg" loading={subscribing} className="shrink-0">
              Suscribirme
            </Button>
          </form>
        </div>
      </div>
    </section>
  </>
);

export default HomeNewsletterCta;