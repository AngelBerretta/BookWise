const PostThumb = ({ thumbnail, title, className = 'w-14 h-10' }) => (
  <div className={`${className} rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-[var(--code-bg)] border border-[var(--border)]`}>
    {thumbnail ? (
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    ) : (
      <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 text-[var(--border)]">
        <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="5" cy="6.5" r="1.25" stroke="currentColor" strokeWidth="1.25" />
        <path d="M2.5 11.5 6 8l2 2 2.5-2.5L13.5 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </div>
);

export default PostThumb;