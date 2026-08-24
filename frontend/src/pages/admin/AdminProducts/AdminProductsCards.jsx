import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import TrashIcon from '../../../components/ui/icons/TrashIcon';
import ProductThumb from './ProductThumb';
import { checkboxCls, fmt } from './adminProductsConfig';

const AdminProductsCards = ({
  products, loading,
  selected, allSelected, toggleSelect, toggleSelectAll,
  openEdit, requestDelete,
}) => (
  <div
    className="md:hidden flex flex-col gap-3"
    style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
  >
    <label className="flex items-center gap-2 text-sm text-[var(--text)] px-1">
      <input type="checkbox" className={checkboxCls} checked={allSelected} onChange={toggleSelectAll} />
      Seleccionar todos
    </label>

    {products.map((p) => (
      <div
        key={p._id}
        className={[
          'rounded-xl border p-4 flex flex-col gap-3 transition-colors',
          selected.has(p._id) ? 'border-[var(--accent-border)] bg-[var(--accent-bg)]' : 'border-[var(--border)] bg-[var(--bg)]',
        ].join(' ')}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className={`${checkboxCls} mt-1 shrink-0`}
            checked={selected.has(p._id)}
            onChange={() => toggleSelect(p._id)}
            aria-label={`Seleccionar "${p.title}"`}
          />
          <ProductThumb thumbnail={p.thumbnails?.[0]} title={p.title} />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[var(--text-h)] line-clamp-2 leading-snug">{p.title}</p>
            {p.author && <p className="text-xs text-[var(--text)] truncate mt-0.5">{p.author}</p>}
            <div className="mt-1.5"><Badge category={p.category} /></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-[var(--border)] pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--text)] opacity-60">Precio</p>
            <p className="font-medium text-[var(--text-h)]">{fmt(p.price)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--text)] opacity-60">Stock</p>
            <p className={`font-medium tabular-nums ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-[var(--text-h)]'}`}>{p.stock}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--text)] opacity-60">Publicación</p>
            <p className="text-[var(--text)]">{p.publicationDate ?? <span className="opacity-40 italic">—</span>}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--text)] opacity-60">Páginas</p>
            <p className="text-[var(--text)] tabular-nums">{p.pages ? `${p.pages} págs.` : <span className="opacity-40 italic">—</span>}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(p)}>Editar</Button>
          <button
            onClick={() => requestDelete(p)}
            className="flex-1 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-2"
            title={`Eliminar "${p.title}"`}
            aria-label={`Eliminar "${p.title}"`}
          >
            <TrashIcon className="w-5 h-5" />
            <span className="text-xs font-medium">Eliminar</span>
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default AdminProductsCards;