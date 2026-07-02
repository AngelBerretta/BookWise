import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useBlog from '../hooks/useBlog';
import PostDetail from '../components/blog/PostDetail';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

/**
 * Página de detalle de un post del blog.
 * Obtiene el post por slug desde la URL y renderiza PostDetail.
 */
const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { post, loading, error, fetchPostBySlug } = useBlog();

  useEffect(() => {
    if (slug) fetchPostBySlug(slug);
  }, [slug, fetchPostBySlug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner size="lg" className="text-[var(--accent)]" />
      </div>
    );
  }

  /* ── Error / no encontrado ── */
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <EmptyState
          title="Post no encontrado"
          description={error ?? 'El artículo que buscás no existe o fue eliminado.'}
          action={{ label: 'Volver al blog', onClick: () => navigate('/blog') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Navegación */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
              Volver al blog
            </Button>
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-2 text-sm text-[var(--text)]">
            <Link to="/" className="hover:text-[var(--text-h)] transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-[var(--text-h)] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[var(--text-h)] line-clamp-1">{post.title}</span>
          </nav>
        </div>

        {/* Contenido del post */}
        <PostDetail post={post} />

        {/* Footer del post */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex justify-center">
          <Link to="/blog">
            <Button variant="secondary" size="md">
              ← Ver todos los artículos
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BlogPost;