import { SearchIcon } from '../../ui/icons/NavIcons';
import Spinner from '../../ui/Spinner';

const SearchModalHeader = ({ query, setQuery, loading, onSubmit, inputRef }) => (
  <form onSubmit={onSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] shrink-0">
    <span className="text-[var(--text)] shrink-0">
      <SearchIcon />
    </span>
    <input
      ref={inputRef}
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Buscar libros, autores, artículos del blog…"
      className="flex-1 min-w-0 bg-transparent outline-none text-base text-[var(--text-h)] placeholder:text-[var(--text)] placeholder:opacity-50"
    />
    {loading && <Spinner size="sm" className="text-[var(--text)] shrink-0" />}
    <kbd className="hidden sm:flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-[var(--text)] border border-[var(--border)] bg-[var(--bg-subtle)] shrink-0">
      ESC
    </kbd>
  </form>
);

export default SearchModalHeader;