import { SortArrow } from './icons';

const SortableHeader = ({ label, field, sort, onSort }) => {
  const direction = sort === `${field}-asc` ? 'asc' : sort === `${field}-desc` ? 'desc' : null;
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:text-[var(--text-h)] transition-colors"
        aria-label={`Ordenar por ${label}`}
      >
        {label}
        <SortArrow direction={direction} />
      </button>
    </th>
  );
};

export default SortableHeader;