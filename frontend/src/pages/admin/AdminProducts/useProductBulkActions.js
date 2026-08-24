import { useState } from 'react';
import * as productService from '../../../services/productService';

const useProductBulkActions = (products, fetchProducts, showToast) => {
  const [selected, setSelected] = useState(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
  const [bulkCategoryValue, setBulkCategoryValue] = useState('');
  const [bulkCategoryWorking, setBulkCategoryWorking] = useState(false);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allSelected = products.length > 0 && products.every((p) => selected.has(p._id));

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p._id)));
  };

  const confirmBulkDelete = async () => {
    setBulkDeleting(true);
    const count = selected.size;
    try {
      await productService.bulkDeleteProducts([...selected]);
      showToast({
        type: 'success',
        message: `${count} producto${count !== 1 ? 's' : ''} eliminado${count !== 1 ? 's' : ''}.`,
      });
      setSelected(new Set());
      fetchProducts();
    } catch (err) {
      showToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'No se pudieron eliminar los productos seleccionados.',
      });
    } finally {
      setBulkDeleting(false);
      setBulkDeleteOpen(false);
    }
  };

  const confirmBulkCategory = async () => {
    if (!bulkCategoryValue) return;
    setBulkCategoryWorking(true);
    const count = selected.size;
    try {
      await productService.bulkUpdateCategory([...selected], bulkCategoryValue);
      showToast({
        type: 'success',
        message: `${count} producto${count !== 1 ? 's' : ''} movido${count !== 1 ? 's' : ''} de categoría.`,
      });
      setSelected(new Set());
      setBulkCategoryOpen(false);
      setBulkCategoryValue('');
      fetchProducts();
    } catch (err) {
      showToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'No se pudo cambiar la categoría de los productos seleccionados.',
      });
    } finally {
      setBulkCategoryWorking(false);
    }
  };

  return {
    selected, setSelected, toggleSelect, allSelected, toggleSelectAll,
    bulkDeleteOpen, setBulkDeleteOpen, bulkDeleting, confirmBulkDelete,
    bulkCategoryOpen, setBulkCategoryOpen, bulkCategoryValue, setBulkCategoryValue,
    bulkCategoryWorking, confirmBulkCategory,
  };
};

export default useProductBulkActions;