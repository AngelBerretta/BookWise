/**
 * Marca de BookWise — búho estilizado posado sobre un libro abierto,
 * en blanco sobre una placa circular de `var(--brand)` (fija, no se
 * invierte en dark mode — ver index.css).
 *
 * @param {{ size?: number, className?: string }} props
 */
const LogoMark = ({ size = 36, className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="50" fill="var(--brand)" />

    {/* Libro abierto */}
    <path
      d="M50 55
         C 39 51, 25 53, 17 59
         C 16 60, 16 61.3, 17 62.2
         L 21 76.5
         C 21.6 77.7, 22.9 78.3, 24.1 77.9
         C 33 75, 42.5 76.2, 50 80.5 Z"
      fill="#ffffff"
    />
    <path
      d="M50 55
         C 61 51, 75 53, 83 59
         C 84 60, 84 61.3, 83 62.2
         L 79 76.5
         C 78.4 77.7, 77.1 78.3, 75.9 77.9
         C 67 75, 57.5 76.2, 50 80.5 Z"
      fill="#ffffff"
    />
    <path d="M50 55 L50 80.5" stroke="var(--brand)" strokeWidth="1.4" strokeLinecap="round" />

    {/* Alas (detrás del cuerpo) */}
    <path
      d="M33 30 C 21 34, 15 46, 19 59 C 20.5 63, 23 65, 26 66
         C 24 58, 25 48, 30 40 C 32.5 36, 35 32, 38 29 Z"
      fill="#ffffff"
    />
    <path
      d="M67 30 C 79 34, 85 46, 81 59 C 79.5 63, 77 65, 74 66
         C 76 58, 75 48, 70 40 C 67.5 36, 65 32, 62 29 Z"
      fill="#ffffff"
    />

    {/* Cuerpo */}
    <path
      d="M50 19
         C 63 19, 71.5 29, 71.5 41.5
         C 71.5 52.5, 63 59, 50 59
         C 37 59, 28.5 52.5, 28.5 41.5
         C 28.5 29, 37 19, 50 19 Z"
      fill="#ffffff"
    />

    {/* Separación ala / cuerpo */}
    <path d="M31 34 C 27 42, 27 52, 32 60" stroke="var(--brand)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M69 34 C 73 42, 73 52, 68 60" stroke="var(--brand)" strokeWidth="1.4" fill="none" strokeLinecap="round" />

    {/* Ojos */}
    <circle cx="41" cy="38" r="7.5" fill="var(--brand)" />
    <circle cx="59" cy="38" r="7.5" fill="var(--brand)" />
    <circle cx="41" cy="38" r="2.8" fill="#ffffff" />
    <circle cx="59" cy="38" r="2.8" fill="#ffffff" />

    {/* Pico */}
    <path d="M46 46 L54 46 L50 53 Z" fill="var(--brand)" />
  </svg>
);

export default LogoMark;
