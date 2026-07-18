import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import useBlog                 from '../../hooks/useBlog';
import * as blogService        from '../../services/blogService';
import PostForm                from '../../components/blog/PostForm';
import Modal                   from '../../components/ui/Modal';
import ConfirmDialog           from '../../components/ui/ConfirmDialog';
import Button                  from '../../components/ui/Button';
import useToast                from '../../hooks/useToast';
import EmptyState              from '../../components/ui/EmptyState';
import Input                   from '../../components/ui/Input';
import Pagination              from '../../components/ui/Pagination';
import BulkActionBar           from '../../components/ui/BulkActionBar';
import TrashIcon from "../../components/ui/icons/TrashIcon";
import useSlashFocus from '../../hooks/useSlashFocus';

const checkboxCls = 'w-4 h-4 rounded cursor-pointer accent-[var(--accent)]';

/* ─── Miniatura del post — mismo criterio visual que Productos ─────────────── */
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

/* ─── Badge de estado — reutilizado en tabla y cards ────────────────────────── */
const StatusBadge = ({ published }) => (
  <span className={[
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
    published
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      : 'bg-[var(--code-bg)] text-[var(--text)]',
  ].join(' ')}>
    <span className={`w-2 h-2 rounded-full ${published ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
    {published ? 'Publicado' : 'Borrador'}
  </span>
);

const AdminBlog = () => {
  const { setExtraCrumb } = useOutletContext();
  const { showToast } = useToast();
  const {
    posts, loading, totalDocs, refetch, deletePost,
    search, setSearch, published, setPublished, page, setPage, totalPages,
  } = useBlog();

  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const [selected, setSelected]             = useState(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkWorking, setBulkWorking]       = useState(false);

  const searchInputRef = useRef(null);
  useSlashFocus(searchInputRef);

  useEffect(() => {
    if (!modalOpen) { setExtraCrumb(null); return; }
    setExtraCrumb({ label: editPost ? `Editar "${editPost.title}"` : 'Nuevo post' });
    return () => setExtraCrumb(null);
  }, [modalOpen, editPost, setExtraCrumb]);

  // La selección solo tiene sentido sobre la página/búsqueda actual.
  // Se limpia ajustando el estado durante el render (en vez de un efecto)
  // cuando cambia alguno de los filtros, siguiendo el patrón recomendado
  // por React para "resetear estado cuando cambian otros valores".
  const [selectionFilters, setSelectionFilters] = useState({ page, search, published });
  if (selectionFilters.page !== page || selectionFilters.search !== search || selectionFilters.published !== published) {
    setSelectionFilters({ page, search, published });
    setSelected(new Set());
  }

  const openCreate = () => { setEditPost(null); setModalOpen(true); };
  const openEdit   = (p)  => { setEditPost(p);  setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); setEditPost(null); };

  const handleSuccess = () => {
    closeModal();
    showToast({ type: 'success', message: editPost ? 'Post actualizado.' : 'Post creado.' });
    refetch();
  };

  const requestDelete = (post) => setConfirmTarget(post);

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget._id);
    try {
      await deletePost(confirmTarget._id);
      showToast({ type: 'success', message: `"${confirmTarget.title}" eliminado.` });
      refetch();
    } catch (err) {
      showToast({ type: 'error', message: err?.message || 'No se pudo eliminar el post.' });
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
      showToast({ type: 'success', message: `${count} post${count !== 1 ? 's' : ''} eliminado${count !== 1 ? 's' : ''}.` });
      setSelected(new Set());
      refetch();
    } catch (err) {
      showToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'No se pudieron eliminar los posts seleccionados.',
      });
    } finally {
      setBulkWorking(false);
      setBulkDeleteOpen(false);
    }
  };

  const bulkSetPublished = async (publishedValue) => {
    setBulkWorking(true);
    const count = selected.size;
    try {
      await blogService.bulkUpdatePosts([...selected], publishedValue);
      showToast({
        type: 'success',
        message: `${count} post${count !== 1 ? 's' : ''} ${publishedValue ? 'publicado' : 'pasado a borrador'}${count !== 1 ? 's' : ''}.`,
      });
      setSelected(new Set());
      refetch();
    } catch {
      showToast({ type: 'error', message: 'No se pudo actualizar el estado de los posts seleccionados.' });
    } finally {
      setBulkWorking(false);
    }
  };

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const authorName = (author) =>
    typeof author === 'object' ? (author?.username ?? '—') : (author ?? '—');

  const toggleDraftsOnly = () => setPublished((prev) => (prev === false ? undefined : false));
  const hasActiveFilters = Boolean(search || published !== undefined);

  return (
    <>
      {modalOpen && (
        <Modal title={editPost ? 'Editar post' : 'Nuevo post'} onClose={closeModal} size="xl">
          <PostForm key={editPost?._id ?? 'new'} post={editPost} onSuccess={handleSuccess} onCancel={closeModal} />
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

        {/* Barra de filtros */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-64">
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Buscar por título, contenido o tag… ( / )"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={toggleDraftsOnly}
            aria-pressed={published === false}
            className={[
              'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
              published === false
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--bg-subtle)]',
            ].join(' ')}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${published === false ? 'bg-white' : 'bg-[var(--border)]'}`} />
            Solo borradores
          </button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setPublished(undefined); }}>
              Limpiar filtros
            </Button>
          )}
        </div>

        {!loading && posts.length === 0 && (
          <EmptyState
            title={hasActiveFilters ? 'Sin resultados' : 'No hay posts'}
            description={
              hasActiveFilters
                ? (search ? `No encontramos posts para "${search}".` : 'No hay posts que coincidan con el filtro.')
                : 'Creá el primer post del blog.'
            }
            action={
              hasActiveFilters
                ? { label: 'Limpiar filtros', onClick: () => { setSearch(''); setPublished(undefined); } }
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
                    {['Post', 'Autor', 'Estado', 'Tags', 'Fecha', 'Acciones'].map((h) => (
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
                      className={[
                        'transition-colors border-l-4',
                        p.published ? 'border-l-emerald-500' : 'border-l-transparent',
                        selected.has(p._id) ? 'bg-[var(--accent-bg)]' : 'hover:bg-[var(--bg-subtle)]',
                      ].join(' ')}
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
                        <div className="flex items-center gap-3">
                          <PostThumb thumbnail={p.thumbnail} title={p.title} />
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--text-h)] line-clamp-2 leading-snug">{p.title}</p>
                            <p className="text-xs text-[var(--text)] opacity-60 mt-0.5 font-mono truncate">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--text)]">{authorName(p.author)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge published={p.published} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {p.tags?.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[var(--accent-bg)] text-[var(--accent)]">{tag}</span>
                          ))}
                          {p.tags?.length > 2 && (
                            <span
                              className="text-xs text-[var(--text)] opacity-60 cursor-default"
                              title={p.tags.slice(2).join(', ')}
                            >
                              +{p.tags.length - 2}
                            </span>
                          )}
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
                  'rounded-xl border p-4 flex flex-col gap-3 transition-colors border-l-4',
                  p.published ? 'border-l-emerald-500' : '',
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
                  <PostThumb thumbnail={p.thumbnail} title={p.title} className="w-14 h-10 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-[var(--text-h)] line-clamp-2 leading-snug">{p.title}</p>
                    </div>
                    <p className="text-xs text-[var(--text)] opacity-60 mt-0.5 font-mono truncate">{p.slug}</p>
                    <div className="mt-1.5"><StatusBadge published={p.published} /></div>
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
                    {p.tags.length > 4 && (
                      <span
                        className="text-xs text-[var(--text)] opacity-60 cursor-default"
                        title={p.tags.slice(4).join(', ')}
                      >
                        +{p.tags.length - 4}
                      </span>
                    )}
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
