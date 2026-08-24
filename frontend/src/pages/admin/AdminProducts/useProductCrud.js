import { useState, useEffect } from 'react';
import * as productService from '../../../services/productService';

const useProductCrud = (fetchProducts, showToast, setExtraCrumb) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!modalOpen) { setExtraCrumb(null); return; }
    setExtraCrumb({
      label: editProduct ? `Editar "${editProduct.title}"` : 'Nuevo producto',
    });
    return () => setExtraCrumb(null);
  }, [modalOpen, editProduct, setExtraCrumb]);

  const openCreate = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p) => { setEditProduct(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProduct(null); };

  const handleSuccess = () => {
    closeModal();
    showToast({
      type: 'success',
      message: editProduct ? 'Producto actualizado.' : 'Producto creado.',
    });
    fetchProducts();
  };

  const requestDelete = (product) => setConfirmTarget(product);

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget._id);
    try {
      await productService.deleteProduct(confirmTarget._id);
      showToast({ type: 'success', message: `"${confirmTarget.title}" eliminado.` });
      fetchProducts();
    } catch (err) {
      showToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'No se pudo eliminar el producto.',
      });
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  };

  return {
    modalOpen, editProduct, formLoading, setFormLoading,
    openCreate, openEdit, closeModal, handleSuccess,
    confirmTarget, setConfirmTarget, deletingId, requestDelete, confirmDelete,
  };
};

export default useProductCrud;