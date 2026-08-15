import DualRangeSlider from './DualRangeSlider';
import PriceNumberInputs from './PriceNumberInputs';

const sectionTitleCls = 'font-headline text-lg italic tracking-tight';
const sectionTitleStyle = { color: 'var(--text-h)', fontFamily: "'Newsreader', Georgia, serif" };

const FilterPriceRange = ({ maxPrice, priceRange, setPriceRange }) => (
  <div className="flex flex-col gap-4">
    <h3 className={sectionTitleCls} style={sectionTitleStyle}>Rango de precio</h3>
    <div className="flex flex-col gap-3">
      <DualRangeSlider min={0} max={maxPrice} value={priceRange} onChange={setPriceRange} />
      <PriceNumberInputs min={0} max={maxPrice} value={priceRange} onChange={setPriceRange} />

      {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
        <button
          onClick={() => setPriceRange([0, maxPrice])}
          className="font-label text-xs w-fit transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-h)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          Restablecer precio
        </button>
      )}
    </div>
  </div>
);

export default FilterPriceRange;