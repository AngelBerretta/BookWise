import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import ProductForm from '../../../components/product/ProductForm';

const AdminProductsFormModal = ({ editProduct, formLoading, closeModal, handleSuccess, setFormLoading }) => (
  <Modal
    title={editProduct ? 'Editar producto' : 'Nuevo producto'}
    onClose={closeModal}
    size="lg"
    footer={
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={closeModal}
          disabled={formLoading}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="product-form"
          variant="primary"
          loading={formLoading}
          className="w-full sm:w-auto"
        >
          {editProduct ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    }
  >
    <ProductForm
      key={editProduct?._id ?? 'new'}
      product={editProduct}
      onSuccess={handleSuccess}
      onCancel={closeModal}
      showActions={false}
      onLoadingChange={setFormLoading}
    />
  </Modal>
);

export default AdminProductsFormModal;