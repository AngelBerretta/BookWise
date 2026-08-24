import useAdminProductsPage from './useAdminProductsPage';
import AdminProductsHeader from './AdminProductsHeader';
import AdminProductsFilters from './AdminProductsFilters';
import AdminProductsTable from './AdminProductsTable';
import AdminProductsCards from './AdminProductsCards';
import AdminProductsFormModal from './AdminProductsFormModal';
import AdminProductsBulkModals from './AdminProductsBulkModals';
import EmptyState from '../../../components/ui/EmptyState';
import Pagination from '../../../components/ui/Pagination';
import BulkActionBar from '../../../components/ui/BulkActionBar';
import Button from '../../../components/ui/Button';

const AdminProducts = () => {
  const state = useAdminProductsPage();
  const {
    products, loading, showSkeleton, totalDocs, totalPages, page, setPage,
    modalOpen, hasActiveFilters, clearFilters, openCreate,
    selected, setSelected, setBulkDeleteOpen, setBulkCategoryOpen,
  } = state;

  return (
    <>
      {modalOpen && <AdminProductsFormModal {...state} />}
      <AdminProductsBulkModals {...state} />

      <div className="container">
        <AdminProductsHeader totalDocs={totalDocs} onCreate={openCreate} />
        <AdminProductsFilters {...state} />

        {!loading && products.length === 0 && (
          <EmptyState
            title={hasActiveFilters ? 'Sin resultados' : 'No hay productos'}
            description={
              hasActiveFilters
                ? 'No encontramos productos que coincidan con los filtros aplicados.'
                : 'Creá el primer producto del catálogo.'
            }
            action={
              hasActiveFilters
                ? { label: 'Limpiar filtros', onClick: clearFilters }
                : { label: 'Crear producto', onClick: openCreate }
            }
          />
        )}

        {(showSkeleton || products.length > 0) && <AdminProductsTable {...state} />}
        {!showSkeleton && products.length > 0 && <AdminProductsCards {...state} />}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button variant="secondary" size="sm" onClick={() => setBulkCategoryOpen(true)}>
          Cambiar categoría
        </Button>
        <Button variant="danger" size="sm" onClick={() => setBulkDeleteOpen(true)}>
          Eliminar seleccionados
        </Button>
      </BulkActionBar>
    </>
  );
};

export default AdminProducts;