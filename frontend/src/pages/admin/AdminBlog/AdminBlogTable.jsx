import Button from '../../../components/ui/Button';
import TrashIcon from '../../../components/ui/icons/TrashIcon';
import PostThumb from './PostThumb';
import StatusBadge from './StatusBadge';
import { fmtDate, authorName } from './adminBlogHelpers';

const checkboxCls = 'w-4 h-4 rounded cursor-pointer accent-[var(--accent)]';

const AdminBlogTable = ({ posts, loading, selected, allSelected, onToggleSelect, onToggleSelectAll, onEdit, onDelete }) => (
  <div
    style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
    className="hidden md:block rounded-2xl border border-[var(--border)] overflow-hidden"
  >
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border)]">
          <tr>
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                className={checkboxCls}
                checked={allSelected}
                onChange={onToggleSelectAll}
                aria-label="Seleccionar todos los posts de esta página"
              />
            </th>
            {['Post', 'Autor', 'Estado', 'Tags', 'Fecha', 'Acciones'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] bg-[var(--bg)]">
          {posts.map((p) => (
            <tr
              key={p._id}
              className={[
                'transition-colors border-l-4',
                p.published ? 'border-l-emerald-500' : 'border-l-transparent',
                selected.has(p._id) ? 'bg-[var(--accent-bg)]' : 'hover:bg-[var(--bg-subtle)]',
              ].join(' ')}
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  className={checkboxCls}
                  checked={selected.has(p._id)}
                  onChange={() => onToggleSelect(p._id)}
                  aria-label={`Seleccionar "${p.title}"`}
                />
              </td>
              <td className="px-4 py-3 max-w-xs">
                <div className="flex items-center gap-3">
                  <PostThumb thumbnail={p.thumbnail} title={p.title} />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text-h)] line-clamp-2 leading-snug">{p.title}</p>
                    <p className="text-xs text-[var(--text)] opacity-60 mt-0.5 font-mono truncate">{p.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-[var(--text)]">{authorName(p.author)}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge published={p.published} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-[160px]">
                  {p.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[var(--accent-bg)] text-[var(--accent)]">{tag}</span>
                  ))}
                  {p.tags?.length > 2 && (
                    <span
                      className="text-xs text-[var(--text)] opacity-60 cursor-default"
                      title={p.tags.slice(2).join(', ')}
                    >
                      +{p.tags.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--text)]">{fmtDate(p.createdAt)}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminBlogTable;