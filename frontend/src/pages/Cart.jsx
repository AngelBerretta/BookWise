import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CartEmpty from '../components/cart/CartEmpty';
import CrossSell from '../components/cart/CrossSell';
import CartItemSkeleton from '../components/cart/CartItemSkeleton';
import MobileCheckoutBar from '../components/cart/MobileCheckoutBar';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import Button from '../components/ui/Button';
import useToast from '../hooks/useToast';
import ConfirmDialog from '../components/ui/ConfirmDialog';

/**
 * Página del carrito de compras.
 * Layout: lista de ítems a la izquierda + resumen a la derecha.
 * Si el carrito está vacío muestra CartEmpty.
 */
const Cart = () => {
  const { products, loading, itemCount, total, clearCart } = useCart();
  const { showToast } = useToast();

  const [clearing, setClearing]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* ── Vaciar carrito ── */
  const handleClearCart = async () => {
    setClearing(true);
    try {
      await clearCart();
      showToast({ type: 'success', message: 'Carrito vaciado correctamente.' });
    } catch {
      showToast({ type: 'error', message: 'No pudimos vaciar el carrito. Intentá de nuevo.' });
    } finally {
      setClearing(false);
      setConfirmOpen(false);
    }
  };

  /* ── Loading inicial ── */
  if (loading && !products.length) {
    return (
      <div className="flex flex-col bg-[var(--bg)]">
         <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-[calc(7rem_+_env(safe-area-inset-bottom))] lg:pb-10">
          <h1 className="h1-editorial mb-8">Mi carrito</h1>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-6">
              {Array.from({ length: 3 }).map((_, i) => <CartItemSkeleton key={i} />)}
            </section>
            <aside
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 h-64 animate-pulse"
              style={{ backgroundColor: 'var(--bg-subtle)' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  }

  /* ── Carrito vacío ── */
  if (!products.length) {
    return (
      <div
        className="flex flex-col bg-[var(--bg)]"
        style={{ minHeight: 'calc(100dvh - var(--navbar-h))' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-[clamp(1.5rem,8dvh,4rem)] pb-10 w-full flex flex-col flex-1">
          <h1 className="h1-editorial mb-2">Mi carrito</h1>
          
          {/* Nuevo contenedor que absorbe el espacio sobrante y centra su contenido */}
          <div className="flex-1 flex flex-col justify-center">
            <CartEmpty />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {confirmOpen && (
        <ConfirmDialog
          title="Vaciar carrito"
          message="¿Querés vaciar todo el carrito? Esta acción no se puede deshacer."
          confirmLabel="Vaciar carrito"
          loading={clearing}
          onConfirm={handleClearCart}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

      <div className="flex flex-col bg-[var(--bg)]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-[calc(6rem_+_env(safe-area-inset-bottom))] lg:pb-10">

          {/* Seguir comprando */}
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text)] hover:text-[var(--text-h)] transition-colors mb-6 w-fit"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            Seguir comprando
          </Link>

          <CheckoutStepper currentStep={1} />

          {/* Encabezado */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="h1-editorial">Mi carrito</h1>
              <p className="mt-1 text-sm text-[var(--text)]">
                {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>

            {/* Vaciar carrito */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmOpen(true)}
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
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">

            {/* Lista de ítems */}
            <section
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 sm:px-6"
              aria-label="Productos en el carrito"
            >
              {/* Cabecera de columnas — solo desktop */}
              <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3 border-b border-[var(--border)]">
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
            <aside aria-label="Resumen del pedido" className="hidden lg:block">
              <CartSummary
                products={products}
                total={total}
                itemCount={itemCount}
              />
            </aside>

          </div>

          {/* También te puede interesar — sugerencias según la categoría
              más frecuente del carrito */}
          <CrossSell />
        </div>
      </div>
      <MobileCheckoutBar
        total={total}
        itemCount={itemCount}
        disabled={clearing}
      />
    </>
  );
};

export default Cart;