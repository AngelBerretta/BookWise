import { useState } from 'react';
import * as blogService from '../../../services/blogService';

/** Selección múltiple sobre la página actual + acciones en lote. */
const useBulkSelection = (posts, refetch, showToast) => {
  const [selected, setSelected] = useState(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkWorking, setBulkWorking] = useState(false);

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

  return {
    selected, setSelected, toggleSelect, allSelected, toggleSelectAll,
    bulkDeleteOpen, setBulkDeleteOpen, bulkWorking, confirmBulkDelete, bulkSetPublished,
  };
};

export default useBulkSelection;