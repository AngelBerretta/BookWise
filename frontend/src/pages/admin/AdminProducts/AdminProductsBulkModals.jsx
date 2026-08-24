import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { PRODUCT_CATEGORIES } from '../../../utils/constants';

const AdminProductsBulkModals = ({
  confirmTarget, setConfirmTarget, deletingId, confirmDelete,
  bulkDeleteOpen, setBulkDeleteOpen, selected, bulkDeleting, confirmBulkDelete,
  bulkCategoryOpen, setBulkCategoryOpen, bulkCategoryValue, setBulkCategoryValue,
  bulkCategoryWorking, confirmBulkCategory,
}) => (
  <>
    {confirmTarget && (
      <ConfirmDialog
        title="Eliminar producto"
        message={`¿Eliminar "${confirmTarget.title}"? Esta acción no se puede deshacer.`}
        loading={deletingId === confirmTarget._id}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    )}

    {bulkDeleteOpen && (
      <ConfirmDialog
        title="Eliminar productos seleccionados"
        message={`¿Eliminar ${selected.size} producto${selected.size !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
        confirmLabel={`Eliminar ${selected.size}`}
        loading={bulkDeleting}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    )}

    {bulkCategoryOpen && (
      <Modal
        title="Cambiar categoría"
        onClose={() => setBulkCategoryOpen(false)}
        size="md"
        footer={
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <Button variant="ghost" onClick={() => setBulkCategoryOpen(false)} disabled={bulkCategoryWorking} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={confirmBulkCategory}
              loading={bulkCategoryWorking}
              disabled={!bulkCategoryValue}
              className="w-full sm:w-auto"
            >
              Mover {selected.size} producto{selected.size !== 1 ? 's' : ''}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--text)] mb-4">
          Elegí la nueva categoría para los {selected.size} producto{selected.size !== 1 ? 's' : ''} seleccionado{selected.size !== 1 ? 's' : ''}.
        </p>
        <Select
          label="Nueva categoría"
          placeholder="Seleccioná una categoría"
          options={PRODUCT_CATEGORIES}
          value={bulkCategoryValue}
          onChange={(e) => setBulkCategoryValue(e.target.value)}
        />
      </Modal>
    )}
  </>
);

export default AdminProductsBulkModals;