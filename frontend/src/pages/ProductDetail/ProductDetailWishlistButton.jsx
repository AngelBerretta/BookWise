const ProductDetailWishlistButton = ({ saved, savingWish, onToggle }) => (
  <button
    onClick={onToggle}
    disabled={savingWish}
    className="px-4 py-4 rounded-lg transition-all duration-300 shrink-0"
    style={{
      border: saved ? '1px solid var(--accent)' : '1px solid rgba(196,198,205,0.5)',
      backgroundColor: saved ? 'var(--accent)' : 'transparent',
      color: saved ? '#ffffff' : 'var(--text)',
    }}
    onMouseEnter={(e) => { if (!saved) e.currentTarget.style.backgroundColor = 'var(--bg-container)'; }}
    onMouseLeave={(e) => { if (!saved) e.currentTarget.style.backgroundColor = 'transparent'; }}
    aria-label={saved ? 'Quitar de guardados' : 'Guardar'}
  >
    <span
      className="material-symbols-outlined"
      style={{ fontSize: '20px', fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
    >
      {savingWish ? 'hourglass_empty' : 'bookmark'}
    </span>
  </button>
);

export default ProductDetailWishlistButton;