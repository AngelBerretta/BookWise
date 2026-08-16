import { Link } from 'react-router-dom';

const SearchModalPostResults = ({ posts, onNavigate }) => (
  <div className="py-2 border-t border-[var(--border-subtle)]">
    <p className="px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text)] opacity-60">
      Blog
    </p>
    {posts.map((post) => (
      <Link
        key={post._id}
        to={`/blog/${post.slug}`}
        onClick={onNavigate}
        className="flex items-center gap-3 px-5 py-2.5 hover:bg-[var(--bg-subtle)] transition-colors"
      >
        <span className="shrink-0 w-9 h-9 rounded-md overflow-hidden border border-[var(--border)] bg-[var(--code-bg)] flex items-center justify-center">
          {post.thumbnail ? (
            <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-sm" style={{ color: 'var(--border)' }}>
              article
            </span>
          )}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-[var(--text-h)] line-clamp-1">
            {post.title}
          </span>
        </span>
      </Link>
    ))}
  </div>
);

export default SearchModalPostResults;