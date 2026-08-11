/**
 * Panel derecho compartido de Login/Register.
 *
 * Antes usaba una imagen hotlinkeada a un dominio externo (Google/Stitch)
 * como fondo — un punto de falla fuera de nuestro control (si esa URL
 * deja de responder, la pantalla de auth se rompe visualmente). Se
 * reemplaza por un fondo 100% propio: degradé de marca + una silueta de
 * lomos de libros generada en SVG, sin ninguna petición de red externa.
 */

/* Alturas determinísticas (sin Math.random, mismo resultado siempre) */
const seededHeights = (n, seed = 7) => {
  const heights = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    heights.push(0.32 + (s / 233280) * 0.62); // 32%–94% de la franja
  }
  return heights;
};

const SPINE_COUNT = 34;
const SPINE_COLORS = [
  'rgba(255,255,255,0.08)',
  'rgba(255,255,255,0.13)',
  'rgba(238,189,142,0.16)', // acento terciario --bw-tertiary-fixed-dim
  'rgba(255,255,255,0.06)',
];

const BAND_W = 400;
const BAND_H = 110;

const BookshelfSilhouette = () => {
  const heights = seededHeights(SPINE_COUNT);
  const gap = 1.6;
  const spineW = BAND_W / SPINE_COUNT - gap;

  return (
    <svg
      viewBox={`0 0 ${BAND_W} ${BAND_H}`}
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-full h-[42%]"
      aria-hidden="true"
    >
      {heights.map((h, i) => {
        const height = h * BAND_H;
        return (
          <rect
            key={i}
            x={i * (spineW + gap)}
            y={BAND_H - height}
            width={spineW}
            height={height}
            rx="1.5"
            fill={SPINE_COLORS[i % SPINE_COLORS.length]}
          />
        );
      })}
      {/* Repisa */}
      <rect x="0" y={BAND_H - 3} width={BAND_W} height="3" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
};

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
    {/* ── Fondo decorativo propio (sin red externa) ── */}
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {/* Glow superior derecho */}
      <div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(238,189,142,0.14) 0%, transparent 70%)',
        }}
      />
      {/* Silueta de lomos de libros */}
      <BookshelfSilhouette />
      {/* Degradé para legibilidad del texto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(4,22,39,0.95) 0%, rgba(4,22,39,0.55) 45%, rgba(4,22,39,0.35) 100%)',
        }}
      />
    </div>

    {/* ── Cita decorativa gigante de fondo ── */}
    <span
      aria-hidden="true"
      className="absolute top-6 left-8 select-none pointer-events-none"
      style={{
        fontFamily: 'var(--heading)',
        fontSize: '14rem',
        lineHeight: 1,
        color: 'rgba(255,255,255,0.05)',
      }}
    >
      &ldquo;
    </span>

    {/* ── Contenido ── */}
    <div className="relative z-10 w-full max-w-2xl px-12 lg:px-24 text-left">
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
        style={{
          backgroundColor: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.20)',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ color: 'var(--bw-secondary)', fontSize: '16px' }}
        >
          auto_awesome
        </span>
        <span
          className="font-label text-xs font-medium tracking-wide"
          style={{ color: 'var(--bw-on-primary)' }}
        >
          {badge}
        </span>
      </div>

      <h2
        className="font-headline font-semibold tracking-tight leading-tight mb-6"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--bw-on-primary)' }}
      >
        {headline}
      </h2>

      <p
        className="font-body text-lg leading-relaxed max-w-xl"
        style={{ color: 'var(--bw-primary-fixed-dim)' }}
      >
        {subtitle}
      </p>

      <div className="mt-16 pl-6" style={{ borderLeft: '2px solid rgba(238,189,142,0.50)' }}>
        <p
          className="font-headline italic text-lg md:text-xl leading-relaxed"
          style={{ color: 'var(--bw-on-primary)' }}
        >
          "Una habitación sin libros es como un cuerpo sin alma."
        </p>
        <p
          className="font-label text-sm mt-2 tracking-widest uppercase"
          style={{ color: 'var(--bw-primary-fixed)' }}
        >
          — Marco Tulio Cicerón
        </p>
      </div>
    </div>
  </div>
);

export default AuthSidePanel;
