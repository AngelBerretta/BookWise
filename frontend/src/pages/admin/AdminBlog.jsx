import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import useBlog                 from '../../hooks/useBlog';
import * as blogService        from '../../services/blogService';
import PostForm                from '../../components/blog/PostForm';
import Modal                   from '../../components/ui/Modal';
import ConfirmDialog           from '../../components/ui/ConfirmDialog';
import Button                  from '../../components/ui/Button';
import Spinner                 from '../../components/ui/Spinner';
import Toast                   from '../../components/ui/Toast';
import EmptyState              from '../../components/ui/EmptyState';
import Input                   from '../../components/ui/Input';
import Pagination              from '../../components/ui/Pagination';
import BulkActionBar           from '../../components/ui/BulkActionBar';
import TrashIcon from "../../components/ui/icons/TrashIcon";

const checkboxCls = 'w-4 h-4 rounded cursor-pointer accent-[var(--accent)]';

const AdminBlog = () => {
  const { setExtraCrumb } = useOutletContext();
  const {
    posts, loading, totalDocs, refetch, deletePost,
    search, setSearch, page, setPage, totalPages,
  } = useBlog();

  const [toast, setToast]         = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const [selected, setSelected]             = useState(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkWorking, setBulkWorking]       = useState(false);

  useEffect(() => {
    if (!modalOpen) { setExtraCrumb(null); return; }
    setExtraCrumb({ label: editPost ? `Editar "${editPost.title}"` : 'Nuevo post' });
    return () => setExtraCrumb(null);
  }, [modalOpen, editPost, setExtraCrumb]);

  useEffect(() => { setSelected(new Set()); }, [page, search]);

  const openCreate = () => { setEditPost(null); setModalOpen(true); };
  const openEdit   = (p)  => { setEditPost(p);  setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); setEditPost(null); };

  const handleSuccess = () => {
    closeModal();
    setToast({ type: 'success', message: editPost ? 'Post actualizado.' : 'Post creado.' });
    refetch();
  };

  const requestDelete = (post) => setConfirmTarget(post);

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget._id);
    try {
      await deletePost(confirmTarget._id);
      setToast({ type: 'success', message: `"${confirmTarget.title}" eliminado.` });
      refetch();
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'No se pudo eliminar el post.' });
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allSelected = posts.length > 0 && posts.every((p) => selected.has(p._id));

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(posts.map((p) => p._id)));
  };

  const confirmBulkDelete = async () => {
    setBulkWorking(true);
    const count = selected.size;
    try {
      await blogService.bulkDeletePosts([...selected]);
      setToast({ type: 'success', message: `${count} post${count !== 1 ? 's' : ''} eliminado${count !== 1 ? 's' : ''}.` });
      setSelected(new Set());
      refetch();
    } catch (err) {
      setToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'No se pudieron eliminar los posts seleccionados.',
      });
    } finally {
      setBulkWorking(false);
      setBulkDeleteOpen(false);
    }
  };

  const bulkSetPublished = async (published) => {
    setBulkWorking(true);
    const count = selected.size;
    try {
      await blogService.bulkUpdatePosts([...selected], published);
      setToast({
        type: 'success',
        message: `${count} post${count !== 1 ? 's' : ''} ${published ? 'publicado' : 'pasado a borrador'}${count !== 1 ? 's' : ''}.`,
      });
      setSelected(new Set());
      refetch();
    } catch {
      setToast({ type: 'error', message: 'No se pudo actualizar el estado de los posts seleccionados.' });
    } finally {
      setBulkWorking(false);
    }
  };

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const authorName = (author) =>
    typeof author === 'object' ? (author?.username ?? '—') : (author ?? '—');

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {modalOpen && (
        <Modal title={editPost ? 'Editar post' : 'Nuevo post'} onClose={closeModal} size="xl">
          <PostForm post={editPost} onSuccess={handleSuccess} onCancel={closeModal} />
        </Modal>
      )}

      {confirmTarget && (
        <ConfirmDialog
          title="Eliminar post"
          message={`¿Eliminar "${confirmTarget.title}"? Esta acción no se puede deshacer.`}
          loading={deletingId === confirmTarget._id}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}

      {bulkDeleteOpen && (
        <ConfirmDialog
          title="Eliminar posts seleccionados"
          message={`¿Eliminar ${selected.size} post${selected.size !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
          confirmLabel={`Eliminar ${selected.size}`}
          loading={bulkWorking}
          onConfirm={confirmBulkDelete}
          onCancel={() => setBulkDeleteOpen(false)}
        />
      )}

      <div className="container">

        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="h1-admin">Blog</h1>
            <p className="mt-1 text-sm text-[var(--text)]">
              {totalDocs} {totalDocs === 1 ? 'post' : 'posts'} en total
            </p>
          </div>
          <Button variant="primary" onClick={openCreate}>
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
            Nuevo post
          </Button>
        </div>

        <div className="mb-6 max-w-sm">
          <Input
            type="search"
            placeholder="Buscar por título, contenido o tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && posts.length === 0 && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" className="text-[var(--accent)]" />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <EmptyState
            title={search ? 'Sin resultados' : 'No hay posts'}
            description={search ? `No encontramos artículos para "${search}".` : 'Publicá el primer artículo del blog.'}
            action={
              search
                ? { label: 'Limpiar búsqueda', onClick: () => setSearch('') }
                : { label: 'Crear post', onClick: openCreate }
            }
          />
        )}

        {/* Tabla — desktop */}
        {posts.length > 0 && (
          <div
            style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
            className="hidden md:block rounded-2xl border border-[var(--border)] overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        className={checkboxCls}
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        aria-label="Seleccionar todos los posts de esta página"
                      />
                    </th>
                    {['Título', 'Autor', 'Estado', 'Tags', 'Fecha', 'Acciones'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--bg)]">
                  {posts.map((p) => (
                    <tr
                      key={p._id}
                      className={['transition-colors', selected.has(p._id) ? 'bg-[var(--accent-bg)]' : 'hover:bg-[var(--bg-subtle)]'].join(' ')}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className={checkboxCls}
                          checked={selected.has(p._id)}
                          onChange={() => toggleSelect(p._id)}
                          aria-label={`Seleccionar "${p.title}"`}
                        />
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-[var(--text-h)] line-clamp-2 leading-snug">{p.title}</p>
                        <p className="text-xs text-[var(--text)] opacity-60 mt-0.5 font-mono truncate">{p.slug}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--text)]">{authorName(p.author)}</td>
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
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {p.tags?.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[var(--accent-bg)] text-[var(--accent)]">{tag}</span>
                          ))}
                          {p.tags?.length > 2 && <span className="text-xs text-[var(--text)] opacity-60">+{p.tags.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--text)]">{fmtDate(p.createdAt)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>Editar</Button>
                          <button
                            onClick={() => requestDelete(p)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title={`Eliminar "${p.title}"`}
                            aria-label={`Eliminar "${p.title}"`}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cards — mobile */}
        {posts.length > 0 && (
          <div
            style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
            className="md:hidden flex flex-col gap-3"
          >
            <label className="flex items-center gap-2 text-sm text-[var(--text)] px-1">
              <input type="checkbox" className={checkboxCls} checked={allSelected} onChange={toggleSelectAll} />
              Seleccionar todos
            </label>

            {posts.map((p) => (
              <div
                key={p._id}
                className={[
                  'rounded-xl border p-4 flex flex-col gap-3 transition-colors',
                  selected.has(p._id) ? 'border-[var(--accent-border)] bg-[var(--accent-bg)]' : 'border-[var(--border)] bg-[var(--bg)]',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className={`${checkboxCls} mt-1 shrink-0`}
                    checked={selected.has(p._id)}
                    onChange={() => toggleSelect(p._id)}
                    aria-label={`Seleccionar "${p.title}"`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-[var(--text-h)] line-clamp-2 leading-snug">{p.title}</p>
                      <span className={[
                        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0',
                        p.published
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-[var(--code-bg)] text-[var(--text)]',
                      ].join(' ')}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.published ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
                        {p.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text)] opacity-60 mt-0.5 font-mono truncate">{p.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--text)] border-t border-[var(--border)] pt-3">
                  <span>{authorName(p.author)}</span>
                  <span className="opacity-40">·</span>
                  <span>{fmtDate(p.createdAt)}</span>
                </div>

                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[var(--accent-bg)] text-[var(--accent)]">{tag}</span>
                    ))}
                    {p.tags.length > 4 && <span className="text-xs text-[var(--text)] opacity-60">+{p.tags.length - 4}</span>}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(p)}>Editar</Button>
                  <Button variant="danger" size="sm" className="flex-1" onClick={() => requestDelete(p)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      </div>

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button variant="secondary" size="sm" disabled={bulkWorking} onClick={() => bulkSetPublished(true)}>
          Publicar
        </Button>
        <Button variant="secondary" size="sm" disabled={bulkWorking} onClick={() => bulkSetPublished(false)}>
          Pasar a borrador
        </Button>
        <Button variant="danger" size="sm" onClick={() => setBulkDeleteOpen(true)}>
          Eliminar seleccionados
        </Button>
      </BulkActionBar>
    </>
  );
};

export default AdminBlog;