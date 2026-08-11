import BookshelfSilhouette from './BookshelfSilhouette';
import AuthSideQuote from './AuthSideQuote';

/**
 * Panel derecho compartido de Login/Register.
 *
 * Fondo 100% propio: degradé de marca + silueta de lomos de libros en
 * SVG, sin ninguna petición de red externa.
 */
const AuthSidePanel = ({
  headline = (
    <>
      Descubrí historias que trascienden el{' '}
      <em style={{ color: 'var(--bw-tertiary-fixed-dim)' }}>tiempo</em>{' '}
      y el{' '}
      <em style={{ color: 'var(--bw-tertiary-fixed-dim)' }}>espacio</em>.
    </>
  ),
  subtitle = 'Sumate a una comunidad exclusiva de bibliófilos. Accedé a ediciones raras, manuscritos de autor y un catálogo meticulosamente organizado del conocimiento humano.',
  badge = 'Novedades de la colección',
}) => (
  <div
    className="hidden md:flex flex-1 relative overflow-hidden items-center justify-center"
    style={{ backgroundColor: 'var(--bw-primary)' }}
  >
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(238,189,142,0.14) 0%, transparent 70%)' }}
      />
      <BookshelfSilhouette />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(4,22,39,0.95) 0%, rgba(4,22,39,0.55) 45%, rgba(4,22,39,0.35) 100%)',
        }}
      />
    </div>

    <span
      aria-hidden="true"
      className="absolute top-6 left-8 select-none pointer-events-none"
      style={{ fontFamily: 'var(--heading)', fontSize: '14rem', lineHeight: 1, color: 'rgba(255,255,255,0.05)' }}
    >
      &ldquo;
    </span>

    <div className="relative z-10 w-full max-w-2xl px-12 lg:px-24 text-left">
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
        style={{
          backgroundColor: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.20)',
        }}
      >
        <span className="material-symbols-outlined" style={{ color: 'var(--bw-secondary)', fontSize: '16px' }}>
          auto_awesome
        </span>
        <span className="font-label text-xs font-medium tracking-wide" style={{ color: 'var(--bw-on-primary)' }}>
          {badge}
        </span>
      </div>

      <h2
        className="font-headline font-semibold tracking-tight leading-tight mb-6"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--bw-on-primary)' }}
      >
        {headline}
      </h2>

      <p className="font-body text-lg leading-relaxed max-w-xl" style={{ color: 'var(--bw-primary-fixed-dim)' }}>
        {subtitle}
      </p>

      <AuthSideQuote />
    </div>
  </div>
);

export default AuthSidePanel;