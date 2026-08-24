import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import useBlog from '../../../hooks/useBlog';
import useToast from '../../../hooks/useToast';
import useSlashFocus from '../../../hooks/useSlashFocus';
import usePostCrud from './usePostCrud';
import useBulkSelection from './useBulkSelection';

const useAdminBlogPage = () => {
  const { setExtraCrumb } = useOutletContext();
  const { showToast } = useToast();
  const {
    posts, loading, totalDocs, refetch, deletePost,
    search, setSearch, published, setPublished, page, setPage, totalPages,
  } = useBlog();

  const crud = usePostCrud(deletePost, refetch, showToast);
  const bulk = useBulkSelection(posts, refetch, showToast);

  const searchInputRef = useRef(null);
  useSlashFocus(searchInputRef);

  useEffect(() => {
    if (!crud.modalOpen) { setExtraCrumb(null); return; }
    setExtraCrumb({ label: crud.editPost ? `Editar "${crud.editPost.title}"` : 'Nuevo post' });
    return () => setExtraCrumb(null);
  }, [crud.modalOpen, crud.editPost, setExtraCrumb]);

  // La selección solo tiene sentido sobre la página/búsqueda actual.
  const [selectionFilters, setSelectionFilters] = useState({ page, search, published });
  if (selectionFilters.page !== page || selectionFilters.search !== search || selectionFilters.published !== published) {
    setSelectionFilters({ page, search, published });
    bulk.setSelected(new Set());
  }

  const toggleDraftsOnly = () => setPublished((prev) => (prev === false ? undefined : false));
  const hasActiveFilters = Boolean(search || published !== undefined);
  const clearFilters = () => { setSearch(''); setPublished(undefined); };

  return {
    posts, loading, totalDocs,
    search, setSearch, published, page, setPage, totalPages,
    toggleDraftsOnly, hasActiveFilters, clearFilters,
    searchInputRef,
    ...crud,
    ...bulk,
  };
};

export default useAdminBlogPage;