import Modal from './Modal';
import Button from './Button';

/**
 * Diálogo de confirmación reutilizable.
 * Reemplaza el window.confirm() nativo del navegador para mantener
 * consistencia visual con el resto del sistema de diseño de BookWise.
 *
 * @param {{
 *   title: string,
 *   message: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   loading?: boolean,
 *   onConfirm: Function,
 *   onCancel: Function,
 * }} props
 */
const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel  = 'Cancelar',
  loading      = false,
  onConfirm,
  onCancel,
}) => (
  <Modal title={title} onClose={onCancel} size="md">
    <div className="flex flex-col gap-6">
      <p className="text-sm text-[var(--text)] leading-relaxed">
        {message}
      </p>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
