import { useState } from 'react';
import useCart from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CartEmpty from '../components/cart/CartEmpty';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Toast from '../components/ui/Toast';

/**
 * Página del carrito de compras.
 * Layout: lista de ítems a la izquierda + resumen a la derecha.
 * Si el carrito está vacío muestra CartEmpty.
 */
const Cart = () => {
  const { products, loading, itemCount, total, clearCart } = useCart();

  const [clearing, setClearing]     = useState(false);
  const [toast, setToast]           = useState(null);

  /* ── Vaciar carrito ── */
  const handleClearCart = async () => {
    if (!window.confirm('¿Querés vaciar todo el carrito?')) return;
    setClearing(true);
    try {
      await clearCart();
      setToast({ type: 'success', message: 'Carrito vaciado correctamente.' });
    } catch {
      setToast({ type: 'error', message: 'No pudimos vaciar el carrito. Intentá de nuevo.' });
    } finally {
      setClearing(false);
    }
  };

  /* ── Loading inicial ── */
  if (loading && !products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner size="lg" className="text-[var(--accent)]" />
      </div>
    );
  }

  /* ── Carrito vacío ── */
  if (!products.length) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-[var(--text-h)] mb-2">Mi carrito</h1>
          <CartEmpty />
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Encabezado */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-h)]">Mi carrito</h1>
              <p className="mt-1 text-sm text-[var(--text)]">
                {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>

            {/* Vaciar carrito */}
            <Button
              variant="ghost"
              size="sm"
              loading={clearing}
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path
                  fillRule="evenodd"
                  d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z"
                  clipRule="evenodd"
                />
              </svg>
              Vaciar carrito
            </Button>
          </div>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* Lista de ítems */}
            <section
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-6"
              aria-label="Productos en el carrito"
            >
              {/* Cabecera de columnas — solo desktop */}
              <div className="hidden sm:grid grid-cols-[1fr_auto] gap-4 py-3 border-b border-[var(--border)]">
                <span className="text-xs font-medium text-[var(--text)] uppercase tracking-wide">
                  Producto
                </span>
                <span className="text-xs font-medium text-[var(--text)] uppercase tracking-wide text-right pr-1">
                  Subtotal
                </span>
              </div>

              {/* Items */}
              {products.map((item) => (
                <CartItem key={item.product?._id ?? item._id} item={item} />
              ))}
            </section>

            {/* Panel resumen */}
            <aside aria-label="Resumen del pedido">
              <CartSummary
                products={products}
                total={total}
                itemCount={itemCount}
              />
            </aside>

          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;