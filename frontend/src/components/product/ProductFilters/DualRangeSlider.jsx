/** Slider doble (min / max) para el rango de precio. */
const DualRangeSlider = ({ min, max, value, onChange }) => {
  const [lo, hi] = value;

  const handleLo = (e) => {
    const v = Number(e.target.value);
    if (v <= hi) onChange([v, hi]);
  };

  const handleHi = (e) => {
    const v = Number(e.target.value);
    if (v >= lo) onChange([lo, v]);
  };

  const pctLo = ((lo - min) / (max - min)) * 100;
  const pctHi = ((hi - min) / (max - min)) * 100;

  // Cuando el thumb "lo" está en la mitad derecha del rango, es el que
  // más probablemente el usuario quiera tocar ahí → sube su prioridad táctil.
  const loOnTop = pctLo > 50;

  return (
    <div className="relative h-6 sm:h-5 flex items-center touch-none">
      <div className="absolute w-full h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
      <div
        className="absolute h-1 rounded-full"
        style={{ left: `${pctLo}%`, width: `${pctHi - pctLo}%`, backgroundColor: 'var(--accent)' }}
      />

      <input
        type="range"
        min={min}
        max={max}
        value={lo}
        onChange={handleLo}
        className="dual-range-input"
        style={{ zIndex: loOnTop ? 5 : 3 }}
        aria-label="Precio mínimo"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={hi}
        onChange={handleHi}
        className="dual-range-input"
        style={{ zIndex: loOnTop ? 3 : 5 }}
        aria-label="Precio máximo"
      />
    </div>
  );
};

export default DualRangeSlider;