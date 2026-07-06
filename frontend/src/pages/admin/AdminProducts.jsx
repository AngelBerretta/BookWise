import { useEffect, useState, useCallback, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as productService from '../../services/productService';
import ProductForm from '../../components/product/ProductForm';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Toast from '../../components/ui/Toast';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import BulkActionBar from '../../components/ui/BulkActionBar';

const PAGE_SIZE = 10;
const checkboxCls = 'w-4 h-4 rounded cursor-pointer accent-[var(--accent)]';

const AdminProducts = () => {
  const { setExtraCrumb } = useOutletContext();
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deletingId, setDeletingId]   = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalDocs, setTotalDocs]     = useState(0);

  const [selected, setSelected]             = useState(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting]     = useState(false);

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
        page,
        limit: PAGE_SIZE,
        sort: 'newest',
      });
      setProducts(Array.isArray(data) ? data : (data?.payload ?? []));
      setTotalPages(data?.totalPages ?? 1);
      setTotalDocs(data?.totalDocs ?? 0);
    } catch {
      setToast({ type: 'error', message: 'No se pudieron cargar los productos.' });
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) setPage(1);
    else didMountRef.current = true;
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  /* La selección solo tiene sentido sobre la página/búsqueda actual */
  useEffect(() => { setSelected(new Set()); }, [page, search]);

  const openCreate = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit   = (p)  => { setEditProduct(p);   setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false);  setEditProduct(null); };

  const handleSuccess = () => {
    closeModal();
    setToast({
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
      setToast({ type: 'success', message: `"${confirmTarget.title}" eliminado.` });
      fetchProducts();
    } catch {
      setToast({ type: 'error', message: 'No se pudo eliminar el producto.' });
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
      setToast({
        type: 'success',
        message: `${count} producto${count !== 1 ? 's' : ''} eliminado${count !== 1 ? 's' : ''}.`,
      });
      setSelected(new Set());
      fetchProducts();
    } catch {
      setToast({ type: 'error', message: 'No se pudieron eliminar los productos seleccionados.' });
    } finally {
      setBulkDeleting(false);
      setBulkDeleteOpen(false);
    }
  };

  const fmt = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  const COLUMNS = ['Producto', 'Categoría', 'Precio', 'Stock', 'Publicación', 'Páginas', 'Acciones'];

  return (
    <>
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {modalOpen && (
        <Modal
          title={editProduct ? 'Editar producto' : 'Nuevo producto'}
          onClose={closeModal}
          size="lg"
        >
          <ProductForm product={editProduct} onSuccess={handleSuccess} onCancel={closeModal} />
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

        <div className="mb-6 max-w-sm">
          <Input
            type="search"
            placeholder="Buscar por título o descripción…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" className="text-[var(--accent)]" />
          </div>
        )}

        {!loading && products.length === 0 && (
          <EmptyState
            title={search ? 'Sin resultados' : 'No hay productos'}
            description={
              search
                ? `No encontramos productos para "${search}".`
                : 'Creá el primer producto del catálogo.'
            }
            action={
              search
                ? { label: 'Limpiar búsqueda', onClick: () => setSearch('') }
                : { label: 'Crear producto', onClick: openCreate }
            }
          />
        )}

        {/* Tabla — desktop */}
        {!loading && products.length > 0 && (
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
                    {COLUMNS.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--bg)]">
                  {products.map((p) => (
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
                          <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-[var(--code-bg)] border border-[var(--border)]">
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
                        <span className={`font-medium tabular-nums ${p.stock === 0 ? 'text-red-500' : 'text-[var(--text-h)]'}`}>
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
                          <Button variant="danger" size="sm" onClick={() => requestDelete(p)}>Eliminar</Button>
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
        {!loading && products.length > 0 && (
          <div className="md:hidden flex flex-col gap-3">
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
                    <p className={`font-medium tabular-nums ${p.stock === 0 ? 'text-red-500' : 'text-[var(--text-h)]'}`}>{p.stock}</p>
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
                  <Button variant="danger" size="sm" className="flex-1" onClick={() => requestDelete(p)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      </div>

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button variant="danger" size="sm" onClick={() => setBulkDeleteOpen(true)}>
          Eliminar seleccionados
        </Button>
      </BulkActionBar>
    </>
  );
};

export default AdminProducts;