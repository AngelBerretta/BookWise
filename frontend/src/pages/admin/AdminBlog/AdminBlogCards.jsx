import Button from '../../../components/ui/Button';
import PostThumb from './PostThumb';
import StatusBadge from './StatusBadge';
import { fmtDate, authorName } from './adminBlogHelpers';

const checkboxCls = 'w-4 h-4 rounded cursor-pointer accent-[var(--accent)]';

const AdminBlogCards = ({ posts, loading, selected, allSelected, onToggleSelect, onToggleSelectAll, onEdit, onDelete }) => (
  <div
    style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
    className="md:hidden flex flex-col gap-3"
  >
    <label className="flex items-center gap-2 text-sm text-[var(--text)] px-1">
      <input type="checkbox" className={checkboxCls} checked={allSelected} onChange={onToggleSelectAll} />
      Seleccionar todos
    </label>

    {posts.map((p) => (
      <div
        key={p._id}
        className={[
          'rounded-xl border p-4 flex flex-col gap-3 transition-colors border-l-4',
          p.published ? 'border-l-emerald-500' : '',
          selected.has(p._id) ? 'border-[var(--accent-border)] bg-[var(--accent-bg)]' : 'border-[var(--border)] bg-[var(--bg)]',
        ].join(' ')}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className={`${checkboxCls} mt-1 shrink-0`}
            checked={selected.has(p._id)}
            onChange={() => onToggleSelect(p._id)}
            aria-label={`Seleccionar "${p.title}"`}
          />
          <PostThumb thumbnail={p.thumbnail} title={p.title} className="w-14 h-10 mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-[var(--text-h)] line-clamp-2 leading-snug">{p.title}</p>
            </div>
            <p className="text-xs text-[var(--text)] opacity-60 mt-0.5 font-mono truncate">{p.slug}</p>
            <div className="mt-1.5"><StatusBadge published={p.published} /></div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--text)] border-t border-[var(--border)] pt-3">
          <span>{authorName(p.author)}</span>
          <span className="opacity-40">·</span>
          <span>{fmtDate(p.createdAt)}</span>
        </div>

        {p.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {p.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-[var(--accent-bg)] text-[var(--accent)]">{tag}</span>
            ))}
            {p.tags.length > 4 && (
              <span
                className="text-xs text-[var(--text)] opacity-60 cursor-default"
                title={p.tags.slice(4).join(', ')}
              >
                +{p.tags.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(p)}>Editar</Button>
          <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(p)}>Eliminar</Button>
        </div>
      </div>
    ))}
  </div>
);

export default AdminBlogCards;