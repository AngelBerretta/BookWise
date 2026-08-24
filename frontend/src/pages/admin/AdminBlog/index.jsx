import useAdminBlogPage from './useAdminBlogPage';
import AdminBlogHeader from './AdminBlogHeader';
import AdminBlogFilters from './AdminBlogFilters';
import AdminBlogTable from './AdminBlogTable';
import AdminBlogCards from './AdminBlogCards';
import AdminBlogModals from './AdminBlogModals';
import EmptyState from '../../../components/ui/EmptyState';
import Pagination from '../../../components/ui/Pagination';
import BulkActionBar from '../../../components/ui/BulkActionBar';
import Button from '../../../components/ui/Button';

const AdminBlog = () => {
  const {
    posts, loading, totalDocs,
    search, setSearch, published, page, setPage, totalPages,
    toggleDraftsOnly, hasActiveFilters, clearFilters,
    searchInputRef,
    modalOpen, editPost, openCreate, openEdit, closeModal, handleSuccess,
    confirmTarget, setConfirmTarget, deletingId, requestDelete, confirmDelete,
    selected, toggleSelect, allSelected, toggleSelectAll, setSelected,
    bulkDeleteOpen, setBulkDeleteOpen, bulkWorking, confirmBulkDelete, bulkSetPublished,
  } = useAdminBlogPage();

  return (
    <>
      <AdminBlogModals
        modalOpen={modalOpen}
        editPost={editPost}
        onCloseModal={closeModal}
        onSuccess={handleSuccess}
        confirmTarget={confirmTarget}
        deletingId={deletingId}
        onConfirmDelete={confirmDelete}
        onCancelDelete={() => setConfirmTarget(null)}
        bulkDeleteOpen={bulkDeleteOpen}
        selectedCount={selected.size}
        bulkWorking={bulkWorking}
        onConfirmBulkDelete={confirmBulkDelete}
        onCancelBulkDelete={() => setBulkDeleteOpen(false)}
      />

      <div className="container">
        <AdminBlogHeader totalDocs={totalDocs} onCreate={openCreate} />

        <AdminBlogFilters
          searchInputRef={searchInputRef}
          search={search}
          setSearch={setSearch}
          published={published}
          onToggleDraftsOnly={toggleDraftsOnly}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

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
                ? { label: 'Limpiar filtros', onClick: clearFilters }
                : { label: 'Crear post', onClick: openCreate }
            }
          />
        )}

        {posts.length > 0 && (
          <AdminBlogTable
            posts={posts} loading={loading} selected={selected} allSelected={allSelected}
            onToggleSelect={toggleSelect} onToggleSelectAll={toggleSelectAll}
            onEdit={openEdit} onDelete={requestDelete}
          />
        )}

        {posts.length > 0 && (
          <AdminBlogCards
            posts={posts} loading={loading} selected={selected} allSelected={allSelected}
            onToggleSelect={toggleSelect} onToggleSelectAll={toggleSelectAll}
            onEdit={openEdit} onDelete={requestDelete}
          />
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