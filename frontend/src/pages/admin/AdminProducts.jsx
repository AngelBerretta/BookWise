import { useEffect, useState, useCallback, useRef } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import * as productService from '../../services/productService';
import ProductForm from '../../components/product/ProductForm';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import useToast from '../../hooks/useToast';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import BulkActionBar from '../../components/ui/BulkActionBar';
import TrashIcon from "../../components/ui/icons/TrashIcon";
import useSlashFocus from '../../hooks/useSlashFocus';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const PAGE_SIZE = 10;
const checkboxCls = 'w-4 h-4 rounded cursor-pointer accent-[var(--accent)]';

const STOCK_OPTIONS = [
  { value: 'out', label: 'Sin stock' },
  { value: 'low', label: 'Stock bajo (≤5)' },
];

const COLUMNS_STATIC = ['Producto', 'Categoría'];
const COLUMNS_END    = ['Publicación', 'Páginas', 'Acciones'];

/* ─── Ícono de orden (flecha) ──────────────────────────────────────────────── */
const SortArrow = ({ direction }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`w-3 h-3 transition-transform duration-150 ${direction === 'desc' ? 'rotate-180' : ''}`}
    style={{ opacity: direction ? 1 : 0.35 }}
  >
    <path fillRule="evenodd" d="M8 3.25a.75.75 0 0 1 .75.75v6.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06L7.25 10.19V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

/* ─── Header ordenable (Precio / Stock) ────────────────────────────────────── */
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

/* ─── Fila skeleton — mismo alto que una fila real ─────────────────────────── */
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3"><div className="w-4 h-4 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-16 rounded-lg bg-[var(--code-bg)] shrink-0" />
        <div className="flex flex-col gap-2 w-full max-w-[180px]">
          <div className="h-3.5 rounded bg-[var(--code-bg)] w-4/5" />
          <div className="h-3 rounded bg-[var(--code-bg)] w-2/5" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3"><div className="h-5 w-20 rounded-full bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-3.5 w-14 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-3.5 w-8 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-3.5 w-16 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-3.5 w-12 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-8 w-20 rounded-lg bg-[var(--code-bg)]" /></td>
  </tr>
);

const AdminProducts = () => {
  const { setExtraCrumb } = useOutletContext();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deletingId, setDeletingId]   = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState(searchParams.get('category') || '');
  const [stock, setStock]             = useState(searchParams.get('stock') || '');
  const [sort, setSort]               = useState('newest');
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalDocs, setTotalDocs]     = useState(0);

  const [selected, setSelected]             = useState(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting]     = useState(false);
  const [formLoading, setFormLoading]       = useState(false);

  const [bulkCategoryOpen, setBulkCategoryOpen]   = useState(false);
  const [bulkCategoryValue, setBulkCategoryValue] = useState('');
  const [bulkCategoryWorking, setBulkCategoryWorking] = useState(false);

  const searchInputRef = useRef(null);
  useSlashFocus(searchInputRef);

  useEffect(() => {
    if (!modalOpen) { setExtraCrumb(null); return; }
    setExtraCrumb({
      label: editProduct ? `Editar "${editProduct.title}"` : 'Nuevo producto',
    });
    return () => setExtraCrumb(null);
  }, [modalOpen, editProduct, setExtraCrumb]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        search: search.trim() || undefined,
        category: category || undefined,
        stock: stock || undefined,
        page,
        limit: PAGE_SIZE,
        sort,
      });
      setProducts(Array.isArray(data) ? data : (data?.payload ?? []));
      setTotalPages(data?.totalPages ?? 1);
      setTotalDocs(data?.totalDocs ?? 0);
    } catch {
      showToast({ type: 'error', message: 'No se pudieron cargar los productos.' });
    } finally {
      setLoading(false);
    }
  }, [search, category, stock, page, sort, showToast]);

  /* Vuelve a página 1 cuando cambia cualquier filtro/orden (no en el mount inicial) */
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) setPage(1);
    else didMountRef.current = true;
  }, [search, category, stock, sort]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchProducts, search]);

  /* Sincroniza filtros con la URL — permite deep-link desde el Dashboard */
  useEffect(() => {
    const next = new URLSearchParams();
    if (category) next.set('category', category);
    if (stock)    next.set('stock', stock);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, stock]);

  /* La selección solo tiene sentido sobre la página/búsqueda actual.
     Se limpia ajustando el estado durante el render (en vez de un efecto)
     cuando cambia alguno de los filtros, siguiendo el patrón recomendado
     por React para "resetear estado cuando cambian otros valores". */
  const [selectionFilters, setSelectionFilters] = useState({ page, search, category, stock, sort });
  if (
    selectionFilters.page !== page ||
    selectionFilters.search !== search ||
    selectionFilters.category !== category ||
    selectionFilters.stock !== stock ||
    selectionFilters.sort !== sort
  ) {
    setSelectionFilters({ page, search, category, stock, sort });
    setSelected(new Set());
  }

  const openCreate = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit   = (p)  => { setEditProduct(p);   setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false);  setEditProduct(null); };

  const handleSuccess = () => {
    closeModal();
    showToast({
      type: 'success',
      message: editProduct ? 'Producto actualizado.' : 'Producto creado.',
    });
    fetchProducts();
  };

  const requestDelete = (product) => setConfirmTarget(product);

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget._id);
    try {
      await productService.deleteProduct(confirmTarget._id);
      showToast({ type: 'success', message: `"${confirmTarget.title}" eliminado.` });
      fetchProducts();
    } catch (err) {
      showToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'No se pudo eliminar el producto.',
      });
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allSelected = products.length > 0 && products.every((p) => selected.has(p._id));

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p._id)));
  };

  const confirmBulkDelete = async () => {
    setBulkDeleting(true);
    const count = selected.size;
    try {
      await productService.bulkDeleteProducts([...selected]);
      showToast({
        type: 'success',
        message: `${count} producto${count !== 1 ? 's' : ''} eliminado${count !== 1 ? 's' : ''}.`,
      });
      setSelected(new Set());
      fetchProducts();
    } catch (err) {
      showToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'No se pudieron eliminar los productos seleccionados.',
      });
    } finally {
      setBulkDeleting(false);
      setBulkDeleteOpen(false);
    }
  };

  const confirmBulkCategory = async () => {
    if (!bulkCategoryValue) return;
    setBulkCategoryWorking(true);
    const count = selected.size;
    try {
      await productService.bulkUpdateCategory([...selected], bulkCategoryValue);
      showToast({
        type: 'success',
        message: `${count} producto${count !== 1 ? 's' : ''} movido${count !== 1 ? 's' : ''} de categoría.`,
      });
      setSelected(new Set());
      setBulkCategoryOpen(false);
      setBulkCategoryValue('');
      fetchProducts();
    } catch (err) {
      showToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'No se pudo cambiar la categoría de los productos seleccionados.',
      });
    } finally {
      setBulkCategoryWorking(false);
    }
  };

  const handleSort = (field) => {
    setSort((prev) => {
      if (prev === `${field}-asc`) return `${field}-desc`;
      if (prev === `${field}-desc`) return 'newest';
      return `${field}-asc`;
    });
  };

  const clearFilters = () => { setCategory(''); setStock(''); setSearch(''); };
  const hasActiveFilters = Boolean(category || stock || search);

  const fmt = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  const showSkeleton = loading && products.length === 0;

  return (
    <>
      {modalOpen && (
        <Modal
          title={editProduct ? 'Editar producto' : 'Nuevo producto'}
          onClose={closeModal}
          size="lg"
          footer={
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={closeModal}
                disabled={formLoading}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="product-form"
                variant="primary"
                loading={formLoading}
                className="w-full sm:w-auto"
              >
                {editProduct ? 'Guardar cambios' : 'Crear producto'}
              </Button>
            </div>
          }
        >
          <ProductForm
            key={editProduct?._id ?? 'new'}
            product={editProduct}
            onSuccess={handleSuccess}
            onCancel={closeModal}
            showActions={false}
            onLoadingChange={setFormLoading}
          />
        </Modal>
      )}

      {confirmTarget && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`¿Eliminar "${confirmTarget.title}"? Esta acción no se puede deshacer.`}
          loading={deletingId === confirmTarget._id}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}

      {bulkDeleteOpen && (
        <ConfirmDialog
          title="Eliminar productos seleccionados"
          message={`¿Eliminar ${selected.size} producto${selected.size !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
          confirmLabel={`Eliminar ${selected.size}`}
          loading={bulkDeleting}
          onConfirm={confirmBulkDelete}
          onCancel={() => setBulkDeleteOpen(false)}
        />
      )}

      {bulkCategoryOpen && (
        <Modal
          title="Cambiar categoría"
          onClose={() => setBulkCategoryOpen(false)}
          size="md"
          footer={
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <Button variant="ghost" onClick={() => setBulkCategoryOpen(false)} disabled={bulkCategoryWorking} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={confirmBulkCategory}
                loading={bulkCategoryWorking}
                disabled={!bulkCategoryValue}
                className="w-full sm:w-auto"
              >
                Mover {selected.size} producto{selected.size !== 1 ? 's' : ''}
              </Button>
            </div>
          }
        >
          <p className="text-sm text-[var(--text)] mb-4">
            Elegí la nueva categoría para los {selected.size} producto{selected.size !== 1 ? 's' : ''} seleccionado{selected.size !== 1 ? 's' : ''}.
          </p>
          <Select
            label="Nueva categoría"
            placeholder="Seleccioná una categoría"
            options={PRODUCT_CATEGORIES}
            value={bulkCategoryValue}
            onChange={(e) => setBulkCategoryValue(e.target.value)}
          />
        </Modal>
      )}

      <div className="container">

        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="h1-admin">Productos</h1>
            <p className="mt-1 text-sm text-[var(--text)]">{totalDocs} en el catálogo</p>
          </div>
          <Button variant="primary" onClick={openCreate}>
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
            Nuevo producto
          </Button>
        </div>

        {/* Barra de filtros */}
        <div className="mb-6 flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-64">
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Buscar por título o descripción… ( / )"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              placeholder="Todas las categorías"
              options={PRODUCT_CATEGORIES}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filtrar por categoría"
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              placeholder="Todo el stock"
              options={STOCK_OPTIONS}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              aria-label="Filtrar por stock"
            />
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>

        {!loading && products.length === 0 && (
          <EmptyState
            title={hasActiveFilters ? 'Sin resultados' : 'No hay productos'}
            description={
              hasActiveFilters
                ? 'No encontramos productos que coincidan con los filtros aplicados.'
                : 'Creá el primer producto del catálogo.'
            }
            action={
              hasActiveFilters
                ? { label: 'Limpiar filtros', onClick: clearFilters }
                : { label: 'Crear producto', onClick: openCreate }
            }
          />
        )}

        {/* Tabla — desktop */}
        {(showSkeleton || products.length > 0) && (
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
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                    <SortableHeader label="Precio" field="price" sort={sort} onSort={handleSort} />
                    <SortableHeader label="Stock" field="stock" sort={sort} onSort={handleSort} />
                    {COLUMNS_END.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap"
                      >
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
                    <tr
                      key={p._id}
                      className={[
                        'transition-colors',
                        selected.has(p._id) ? 'bg-[var(--accent-bg)]' : 'hover:bg-[var(--bg-subtle)]',
                      ].join(' ')}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className={checkboxCls}
                          checked={selected.has(p._id)}
                          onChange={() => toggleSelect(p._id)}
                          aria-label={`Seleccionar "${p.title}"`}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-[var(--code-bg)] border border-[var(--border)]">
                            {p.thumbnails?.[0] ? (
                              <img
                                src={p.thumbnails[0]}
                                alt={p.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 text-[var(--border)]">
                                <rect x="2" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" />
                                <rect x="5" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" fill="var(--bg-subtle)" />
                              </svg>
                            )}
                          </div>
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
                          <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>Editar</Button>
                          <button
                            onClick={() => requestDelete(p)}
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
        )}

        {/* Cards — mobile */}
        {!showSkeleton && products.length > 0 && (
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
                  <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-[var(--code-bg)] border border-[var(--border)]">
                    {p.thumbnails?.[0] ? (
                      <img
                        src={p.thumbnails[0]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 text-[var(--border)]">
                        <rect x="2" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" />
                        <rect x="5" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" fill="var(--bg-subtle)" />
                      </svg>
                    )}
                  </div>
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
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      </div>

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button variant="secondary" size="sm" onClick={() => setBulkCategoryOpen(true)}>
          Cambiar categoría
        </Button>
        <Button variant="danger" size="sm" onClick={() => setBulkDeleteOpen(true)}>
          Eliminar seleccionados
        </Button>
      </BulkActionBar>
    </>
  );
};

export default AdminProducts;
