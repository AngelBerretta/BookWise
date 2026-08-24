import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import PostForm from '../../../components/blog/PostForm';

const AdminBlogModals = ({
  modalOpen, editPost, onCloseModal, onSuccess,
  confirmTarget, deletingId, onConfirmDelete, onCancelDelete,
  bulkDeleteOpen, selectedCount, bulkWorking, onConfirmBulkDelete, onCancelBulkDelete,
}) => (
  <>
    {modalOpen && (
      <Modal title={editPost ? 'Editar post' : 'Nuevo post'} onClose={onCloseModal} size="xl">
        <PostForm key={editPost?._id ?? 'new'} post={editPost} onSuccess={onSuccess} onCancel={onCloseModal} />
      </Modal>
    )}

    {confirmTarget && (
      <ConfirmDialog
        title="Eliminar post"
        message={`¿Eliminar "${confirmTarget.title}"? Esta acción no se puede deshacer.`}
        loading={deletingId === confirmTarget._id}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    )}

    {bulkDeleteOpen && (
      <ConfirmDialog
        title="Eliminar posts seleccionados"
        message={`¿Eliminar ${selectedCount} post${selectedCount !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
        confirmLabel={`Eliminar ${selectedCount}`}
        loading={bulkWorking}
        onConfirm={onConfirmBulkDelete}
        onCancel={onCancelBulkDelete}
      />
    )}
  </>
);

export default AdminBlogModals;