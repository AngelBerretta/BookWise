import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AdminBlogFilters = ({
  searchInputRef, search, setSearch,
  published, onToggleDraftsOnly, hasActiveFilters, onClearFilters,
}) => (
  <div className="mb-6 flex flex-wrap items-center gap-3">
    <div className="w-full sm:w-64">
      <Input
        ref={searchInputRef}
        type="search"
        placeholder="Buscar por título, contenido o tag… ( / )"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <button
      type="button"
      onClick={onToggleDraftsOnly}
      aria-pressed={published === false}
      className={[
        'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
        published === false
          ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
          : 'bg-[var(--bg)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--bg-subtle)]',
      ].join(' ')}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${published === false ? 'bg-white' : 'bg-[var(--border)]'}`} />
      Solo borradores
    </button>

    {hasActiveFilters && (
      <Button variant="ghost" size="sm" onClick={onClearFilters}>
        Limpiar filtros
      </Button>
    )}
  </div>
);

export default AdminBlogFilters;