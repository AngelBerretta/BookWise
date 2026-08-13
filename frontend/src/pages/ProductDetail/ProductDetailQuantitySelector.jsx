const ProductDetailQuantitySelector = ({ quantity, setQuantity, maxQty }) => (
  <div className="flex items-center rounded-lg overflow-hidden shrink-0" style={{ border: '1px solid var(--border)' }}>
    <button
      type="button"
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      disabled={quantity <= 1}
      aria-label="Restar una unidad"
      className="px-3 py-3 transition-colors disabled:opacity-40"
      style={{ color: 'var(--text)' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-container)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      −
    </button>
    <span
      role="status"
      aria-live="polite"
      aria-label={`Cantidad: ${quantity}`}
      className="px-4 py-3 text-sm font-medium min-w-[3rem] text-center"
      style={{ color: 'var(--text-h)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
    >
      {quantity}
    </span>
    <button
      type="button"
      onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
      disabled={quantity >= maxQty}
      aria-label="Sumar una unidad"
      className="px-3 py-3 transition-colors disabled:opacity-40"
      style={{ color: 'var(--text)' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-container)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      +
    </button>
  </div>
);

export default ProductDetailQuantitySelector;