const ProductDetailGallery = ({ title, thumbnail }) => (
  <div className="lg:col-span-5 relative">
    <div className="lg:sticky lg:top-32">
      <div
        className="relative rounded-xl p-5 sm:p-8 flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-container)', boxShadow: 'var(--shadow)' }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Portada de ${title}`}
            className="w-full max-w-xs rounded-lg z-10 transition-transform duration-500 hover:-translate-y-2"
            style={{ boxShadow: 'var(--shadow-lg)' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div
            className="w-full max-w-xs rounded-lg z-10 flex flex-col items-center justify-center gap-4 py-16"
            style={{ aspectRatio: '3/4', backgroundColor: 'var(--bg-subtle)', boxShadow: 'var(--shadow-lg)' }}
          >
            <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20" style={{ color: 'var(--border)' }}>
              <rect x="8" y="6" width="36" height="52" rx="4" stroke="currentColor" strokeWidth="2.5" />
              <rect x="18" y="6" width="38" height="52" rx="4" stroke="currentColor" strokeWidth="2.5" fill="var(--bg-subtle)" />
              <line x1="26" y1="20" x2="48" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="26" y1="27" x2="48" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="26" y1="34" x2="38" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm text-center px-4" style={{ color: 'var(--text)', opacity: 0.6 }}>
              {title}
            </span>
          </div>
        )}

        <div
          className="absolute inset-4 rounded-xl -z-10 translate-x-2 translate-y-2 opacity-50"
          style={{ backgroundColor: 'var(--bg-lowest)' }}
        />
      </div>
    </div>
  </div>
);

export default ProductDetailGallery;