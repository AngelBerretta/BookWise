import { Link } from 'react-router-dom';
import PostCard from '../../components/blog/PostCard';
import PostCardSkeleton from '../../components/blog/PostCardSkeleton';
import { FEATURED_POSTS_LIMIT } from './useHomeData';

const HomeBlogPreview = ({ sectionRef, visible, loading, posts, error }) => (
  <section ref={sectionRef} className={`py-14 sm:py-20 reveal ${visible ? 'is-visible' : ''}`}>
    <div className="container">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Editorial
          </p>
          <h2 className="h2-editorial">Del diario del curador</h2>
        </div>
        <Link
          to="/blog"
          className="text-sm font-medium text-[var(--text-h)] flex items-center gap-1 hover:opacity-60 transition-opacity shrink-0"
        >
          Ver todo
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: FEATURED_POSTS_LIMIT }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      ) : error ? (
        <p className="text-center text-[var(--text)] py-12">
          No pudimos cargar los artículos. Probá recargar la página.
        </p>
      ) : (
        <p className="text-center text-[var(--text)] py-12">
          Todavía no hay artículos publicados.
        </p>
      )}
    </div>
  </section>
);

export default HomeBlogPreview;