import PostCard from '../../components/blog/PostCard';
import PostCardSkeleton from '../../components/blog/PostCardSkeleton';
import FeaturedPostSkeleton from '../../components/blog/FeaturedPostSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import useBlogList from './useBlogList';
import BlogHeader from './BlogHeader';
import FeaturedPost from './FeaturedPost';

const Blog = () => {
  const {
    posts, loading, error, search, setSearch,
    page, setPage, totalPages, refetch,
    featured, showFeatured, visiblePosts,
  } = useBlogList();

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <BlogHeader search={search} setSearch={setSearch} />

      <div className="container py-14">
        {loading && posts.length === 0 && (
          <>
            {showFeatured && (
              <div className="mb-16">
                <FeaturedPostSkeleton />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          </>
        )}

        {!loading && error && (
          <EmptyState
            title="No pudimos cargar el blog"
            description={error}
            action={{ label: 'Reintentar', onClick: () => refetch() }}
          />
        )}

        {!loading && !error && posts.length === 0 && (
          <EmptyState
            title={search ? 'Sin resultados' : 'Todavía no hay posts'}
            description={
              search
                ? `No encontramos artículos para "${search}".`
                : 'Volvé pronto, estamos preparando contenido.'
            }
            action={search ? { label: 'Limpiar búsqueda', onClick: () => setSearch('') } : undefined}
          />
        )}

        {posts.length > 0 && showFeatured && featured && (
          <div className="mb-16" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}>
            <FeaturedPost post={featured} />
          </div>
        )}

        {posts.length > 0 && (
          <div
            style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {visiblePosts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default Blog;