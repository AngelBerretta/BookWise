import SortableHeader from './SortableHeader';
import SkeletonRow from './SkeletonRow';
import ProductTableRow from './ProductTableRow';
import { checkboxCls, COLUMNS_STATIC, COLUMNS_END, PAGE_SIZE } from './adminProductsConfig';

const AdminProductsTable = ({
  products, loading, showSkeleton, sort, handleSort,
  selected, allSelected, toggleSelect, toggleSelectAll,
  openEdit, requestDelete,
}) => (
  <div className="hidden md:block rounded-2xl border border-[var(--border)] overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border)]">
          <tr>
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                className={checkboxCls}
                checked={allSelected}
                onChange={toggleSelectAll}
                aria-label="Seleccionar todos los productos de esta página"
              />
            </th>
            {COLUMNS_STATIC.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
            <SortableHeader label="Precio" field="price" sort={sort} onSort={handleSort} />
            <SortableHeader label="Stock" field="stock" sort={sort} onSort={handleSort} />
            {COLUMNS_END.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className="divide-y divide-[var(--border)] bg-[var(--bg)]"
          style={{ opacity: !showSkeleton && loading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
        >
          {showSkeleton
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} />)
            : products.map((p) => (
              <ProductTableRow
                key={p._id}
                product={p}
                selected={selected.has(p._id)}
                onToggleSelect={toggleSelect}
                onEdit={openEdit}
                onDelete={requestDelete}
              />
            ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminProductsTable;