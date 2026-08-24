import CartEmpty from '../../components/cart/CartEmpty';

const CartEmptyState = () => (
  <div
    className="flex flex-col bg-[var(--bg)]"
    style={{ minHeight: 'calc(100dvh - var(--navbar-h))' }}
  >
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-[clamp(1.5rem,8dvh,4rem)] pb-10 w-full flex flex-col flex-1">
      <h1 className="h1-editorial mb-2">Mi carrito</h1>

      <div className="flex-1 flex flex-col justify-center">
        <CartEmpty />
      </div>
    </div>
  </div>
);

export default CartEmptyState;