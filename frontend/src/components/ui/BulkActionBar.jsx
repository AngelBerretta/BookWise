import Button from './Button';

/**
 * Barra flotante de acciones en lote. Aparece cuando hay ítems
 * seleccionados en una tabla admin.
 *
 * @param {number}    count   - cantidad de ítems seleccionados
 * @param {Function}  onClear - deseleccionar todo
 * @param {ReactNode} children - botones de acción específicos
 */
const BulkActionBar = ({ count, onClear, children }) => {
  if (count === 0) return null;

  return (
    <div className="sticky bottom-4 z-20 flex justify-center px-4">
      <div
        className="flex items-center gap-3 flex-wrap rounded-2xl border
                   border-[var(--border)] bg-[var(--bg)] px-5 py-3"
        style={{ boxShadow: 'var(--shadow-lg)' }}
      >
        <span className="text-sm font-medium text-[var(--text-h)] whitespace-nowrap">
          {count} seleccionado{count !== 1 ? 's' : ''}
        </span>
        <div className="w-px h-5 bg-[var(--border)]" aria-hidden="true" />
        <div className="flex items-center gap-2 flex-wrap">{children}</div>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default BulkActionBar;