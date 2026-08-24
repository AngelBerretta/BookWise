import CartItemSkeleton from '../../components/cart/CartItemSkeleton';

const CartLoadingState = () => (
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

export default CartLoadingState;