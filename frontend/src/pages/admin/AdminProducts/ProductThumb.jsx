const ProductThumb = ({ thumbnail, title }) => (
  <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-[var(--code-bg)] border border-[var(--border)]">
    {thumbnail ? (
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    ) : (
      <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 text-[var(--border)]">
        <rect x="2" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" />
        <rect x="5" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" fill="var(--bg-subtle)" />
      </svg>
    )}
  </div>
);

export default ProductThumb;