import { useEffect, useState, useCallback } from 'react';
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

const AdminProducts = () => {
  const { setExtraCrumb } = useOutletContext();
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deletingId, setDeletingId]   = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // producto pendiente de eliminar

  /* Crumb dinámico: refleja el modal abierto, ya que no hay ruta propia */
   useEffect(() => {
     if (!modalOpen) { setExtraCrumb(null); return; }
     setExtraCrumb({
       label: editProduct ? `Editar "${editProduct.title}"` : 'Nuevo producto',
     });
     return () => setExtraCrumb(null);
   }, [modalOpen, editProduct, setExtraCrumb]);

  /* ── Cargar productos ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({ limit: 50 });
      // ✅ Fix: solo un setProducts
      setProducts(Array.isArray(data) ? data : (data?.payload ?? []));
    } catch {
      setToast({ type: 'error', message: 'No se pudieron cargar los productos.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── Modal ── */
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

  /* ── Eliminar ── */
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

  const fmt = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  // ✅ Columnas de la tabla — fácil de agregar/quitar
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
          <ProductForm
            product={editProduct}
            onSuccess={handleSuccess}
            onCancel={closeModal}
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

      <div className="container">

          {/* Encabezado */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="h1-admin">Productos</h1>
              <p className="mt-1 text-sm text-[var(--text)]">
                {products.length} en el catálogo
              </p>
            </div>
            <Button variant="primary" onClick={openCreate}>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
              Nuevo producto
            </Button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Spinner size="lg" className="text-[var(--accent)]" />
            </div>
          )}

          {/* Vacío */}
          {!loading && products.length === 0 && (
            <EmptyState
              title="No hay productos"
              description="Creá el primer producto del catálogo."
              action={{ label: 'Crear producto', onClick: openCreate }}
            />
          )}

          {/* Tabla */}
          {!loading && products.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border)]">
                    <tr>
                      {COLUMNS.map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold
                                     text-[var(--text)] uppercase tracking-wide whitespace-nowrap"
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
                        className="hover:bg-[var(--bg-subtle)] transition-colors"
                      >

                        {/* Producto */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-14 rounded-lg overflow-hidden shrink-0
                                         flex items-center justify-center
                                         bg-[var(--code-bg)] border border-[var(--border)]"
                            >
                              {p.thumbnails?.[0] ? (
                                <img
                                  src={p.thumbnails[0]}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <svg viewBox="0 0 16 16" fill="none"
                                     className="w-5 h-5 text-[var(--border)]">
                                  <rect x="2" y="1" width="9"  height="13" rx="1"
                                        stroke="currentColor" strokeWidth="1.25" />
                                  <rect x="5" y="1" width="9"  height="13" rx="1"
                                        stroke="currentColor" strokeWidth="1.25"
                                        fill="var(--bg-subtle)" />
                                </svg>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-[var(--text-h)] line-clamp-1">
                                {p.title}
                              </p>
                              {p.author && (
                                <p className="text-xs text-[var(--text)] truncate">
                                  {p.author}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Categoría */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge category={p.category} />
                        </td>

                        {/* Precio */}
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-[var(--text-h)]">
                          {fmt(p.price)}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`font-medium tabular-nums ${
                              p.stock === 0 ? 'text-red-500' : 'text-[var(--text-h)]'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>

                        {/* ✅ Publication */}
                        <td className="px-4 py-3 whitespace-nowrap text-[var(--text)]">
                          {p.publicationDate ?? (
                            <span className="text-[var(--text)] opacity-30 italic text-xs">
                              —
                            </span>
                          )}
                        </td>

                        {/* ✅ Pages */}
                        <td className="px-4 py-3 whitespace-nowrap text-[var(--text)]">
                          {p.pages ? (
                            <span className="tabular-nums">{p.pages} págs.</span>
                          ) : (
                            <span className="text-[var(--text)] opacity-30 italic text-xs">
                              —
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => requestDelete(p)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
    </>
  );
};

export default AdminProducts;