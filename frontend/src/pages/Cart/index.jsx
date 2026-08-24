import useCartPage from './useCartPage';
import CartLoadingState from './CartLoadingState';
import CartEmptyState from './CartEmptyState';
import CartPageHeader from './CartPageHeader';
import CartItemsList from './CartItemsList';
import CartSummary from '../../components/cart/CartSummary';
import CrossSell from '../../components/cart/CrossSell';
import MobileCheckoutBar from '../../components/cart/MobileCheckoutBar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

/**
 * Página del carrito de compras.
 * Layout: lista de ítems a la izquierda + resumen a la derecha.
 * Si el carrito está vacío muestra CartEmptyState.
 */
const Cart = () => {
  const {
    products, loading, itemCount, total,
    clearing, confirmOpen, setConfirmOpen, handleClearCart,
  } = useCartPage();

  if (loading && !products.length) return <CartLoadingState />;
  if (!products.length) return <CartEmptyState />;

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

          <CartPageHeader itemCount={itemCount} onClearClick={() => setConfirmOpen(true)} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
            <CartItemsList products={products} />

            <aside aria-label="Resumen del pedido" className="hidden lg:block">
              <CartSummary products={products} total={total} itemCount={itemCount} />
            </aside>
          </div>

          <CrossSell />
        </div>
      </div>
      <MobileCheckoutBar total={total} itemCount={itemCount} disabled={clearing} />
    </>
  );
};

export default Cart;