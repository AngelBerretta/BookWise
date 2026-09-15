import Modal from '../../components/ui/Modal';
import ProductFilters from '../../components/product/ProductFilters';

const ProductsMobileFilters = ({
  open, onClose, activeFilterCount, loading, count,
  filters, setFilters, priceRange, setPriceRange, maxPrice, onClear, hasFilters,
}) => (
  <>
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => onClose(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium"
        style={{ borderColor: 'var(--border)', color: 'var(--text-h)' }}
      >
        <span className="material-symbols-outlined text-[18px]">tune</span>
        Filtros
        {activeFilterCount > 0 && (
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>

    {open && (
      <Modal
        title="Filtros"
        size="md"
        onClose={() => onClose(false)}
        footer={
          <button
            type="button"
            onClick={() => onClose(false)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
          >
            {loading ? 'Buscando…' : `Ver ${count} ${count === 1 ? 'resultado' : 'resultados'}`}
          </button>
        }
      >
        <div className="flex flex-col gap-10">
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
            onClear={onClear}
            hasActiveFilters={!!hasFilters}
          />
        </div>
      </Modal>
    )}
  </>
);

export default ProductsMobileFilters;