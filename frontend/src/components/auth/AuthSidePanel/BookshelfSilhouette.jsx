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

/**
 * Silueta de lomos de libros en SVG — reemplaza la imagen externa que
 * usaba antes AuthSidePanel, sin ninguna petición de red.
 */
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
      <rect x="0" y={BAND_H - 3} width={BAND_W} height="3" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
};

export default BookshelfSilhouette;