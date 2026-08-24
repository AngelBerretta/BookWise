import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import TrashIcon from '../../../components/ui/icons/TrashIcon';
import ProductThumb from './ProductThumb';
import { checkboxCls, fmt } from './adminProductsConfig';

const ProductTableRow = ({ product: p, selected, onToggleSelect, onEdit, onDelete }) => (
  <tr
    className={[
      'transition-colors',
      selected ? 'bg-[var(--accent-bg)]' : 'hover:bg-[var(--bg-subtle)]',
    ].join(' ')}
  >
    <td className="px-4 py-3">
      <input
        type="checkbox"
        className={checkboxCls}
        checked={selected}
        onChange={() => onToggleSelect(p._id)}
        aria-label={`Seleccionar "${p.title}"`}
      />
    </td>

    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <ProductThumb thumbnail={p.thumbnails?.[0]} title={p.title} />
        <div className="min-w-0">
          <p className="font-medium text-[var(--text-h)] line-clamp-1">{p.title}</p>
          {p.author && <p className="text-xs text-[var(--text)] truncate">{p.author}</p>}
        </div>
      </div>
    </td>

    <td className="px-4 py-3 whitespace-nowrap"><Badge category={p.category} /></td>
    <td className="px-4 py-3 whitespace-nowrap font-medium text-[var(--text-h)]">{fmt(p.price)}</td>
    <td className="px-4 py-3 whitespace-nowrap">
      <span className={`font-medium tabular-nums ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-[var(--text-h)]'}`}>
        {p.stock}
      </span>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-[var(--text)]">
      {p.publicationDate ?? <span className="text-[var(--text)] opacity-30 italic text-xs">—</span>}
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-[var(--text)]">
      {p.pages ? <span className="tabular-nums">{p.pages} págs.</span> : <span className="text-[var(--text)] opacity-30 italic text-xs">—</span>}
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => onEdit(p)}>Editar</Button>
        <button
          onClick={() => onDelete(p)}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title={`Eliminar "${p.title}"`}
          aria-label={`Eliminar "${p.title}"`}
        >
          <TrashIcon />
        </button>
      </div>
    </td>
  </tr>
);

export default ProductTableRow;