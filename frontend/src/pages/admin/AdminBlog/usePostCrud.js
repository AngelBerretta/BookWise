import { useState } from 'react';

/** Estado del modal de creación/edición y del borrado individual. */
const usePostCrud = (deletePost, refetch, showToast) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const openCreate = () => { setEditPost(null); setModalOpen(true); };
  const openEdit = (p) => { setEditPost(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditPost(null); };

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

  return {
    modalOpen, editPost, openCreate, openEdit, closeModal, handleSuccess,
    confirmTarget, setConfirmTarget, deletingId, requestDelete, confirmDelete,
  };
};

export default usePostCrud;