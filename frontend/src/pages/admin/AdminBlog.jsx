import { useEffect, useState } from 'react';
import useBlog                 from '../../hooks/useBlog';
import PostForm                from '../../components/blog/PostForm';
import Modal                   from '../../components/ui/Modal';
import Button                  from '../../components/ui/Button';
import Spinner                 from '../../components/ui/Spinner';
import Toast                   from '../../components/ui/Toast';
import EmptyState              from '../../components/ui/EmptyState';

const AdminBlog = () => {
  const { posts, loading, fetchPosts, deletePost } = useBlog();

  const [toast, setToast]         = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  /* ── Modal ── */
  const openCreate = () => { setEditPost(null); setModalOpen(true); };
  const openEdit   = (p)  => { setEditPost(p);  setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); setEditPost(null); };

  const handleSuccess = () => {
    closeModal();
    setToast({
      type: 'success',
      message: editPost ? 'Post actualizado.' : 'Post creado.',
    });
    fetchPosts(); // refresca la lista
  };

  /* ── Eliminar ── */
  const handleDelete = async (post) => {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(post._id);
    try {
      await deletePost(post._id);
      setToast({ type: 'success', message: `"${post.title}" eliminado.` });
    } catch {
      setToast({ type: 'error', message: 'No se pudo eliminar el post.' });
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Helpers ── */
  const fmtDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString('es-AR', {
          day: 'numeric', month: 'short', year: 'numeric',
        })
      : '—';

  const authorName = (author) =>
    typeof author === 'object' ? (author?.username ?? '—') : (author ?? '—');

  return (
    <>
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {modalOpen && (
        <Modal
          title={editPost ? 'Editar post' : 'Nuevo post'}
          onClose={closeModal}
          size="xl"
        >
          <PostForm
            post={editPost}
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        </Modal>
      )}

      <div className="min-h-screen bg-[var(--bg)]">
        <div className="container py-10">

          {/* Encabezado */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-h)]">Blog</h1>
              <p className="mt-1 text-sm text-[var(--text)]">
                {posts.filter((p) => p.published).length} publicados ·{' '}
                {posts.filter((p) => !p.published).length} borradores
              </p>
            </div>
            <Button variant="primary" onClick={openCreate}>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
              Nuevo post
            </Button>
          </div>

          {/* Loading */}
          {loading && posts.length === 0 && (
            <div className="flex justify-center py-20">
              <Spinner size="lg" className="text-[var(--accent)]" />
            </div>
          )}

          {/* Vacío */}
          {!loading && posts.length === 0 && (
            <EmptyState
              title="No hay posts"
              description="Publicá el primer artículo del blog."
              action={{ label: 'Crear post', onClick: openCreate }}
            />
          )}

          {/* Tabla */}
          {posts.length > 0 && (
            <div
              style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
              className="rounded-2xl border border-[var(--border)] overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border)]">
                    <tr>
                      {['Título', 'Autor', 'Estado', 'Tags', 'Fecha', 'Acciones'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] bg-[var(--bg)]">
                    {posts.map((p) => (
                      <tr key={p._id} className="hover:bg-[var(--bg-subtle)] transition-colors">

                        {/* Título */}
                        <td className="px-4 py-3 max-w-xs">
                          <p className="font-medium text-[var(--text-h)] line-clamp-2 leading-snug">
                            {p.title}
                          </p>
                          <p className="text-xs text-[var(--text)] opacity-60 mt-0.5 font-mono truncate">
                            {p.slug}
                          </p>
                        </td>

                        {/* Autor */}
                        <td className="px-4 py-3 whitespace-nowrap text-[var(--text)]">
                          {authorName(p.author)}
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={[
                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                            p.published
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-[var(--code-bg)] text-[var(--text)]',
                          ].join(' ')}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.published ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
                            {p.published ? 'Publicado' : 'Borrador'}
                          </span>
                        </td>

                        {/* Tags */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {p.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-xs bg-[var(--accent-bg)] text-[var(--accent)]"
                              >
                                {tag}
                              </span>
                            ))}
                            {p.tags?.length > 2 && (
                              <span className="text-xs text-[var(--text)] opacity-60">
                                +{p.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Fecha */}
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--text)]">
                          {fmtDate(p.createdAt)}
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              loading={deletingId === p._id}
                              onClick={() => handleDelete(p)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminBlog;