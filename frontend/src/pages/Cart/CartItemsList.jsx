import CartItem from '../../components/cart/CartItem';

const CartItemsList = ({ products }) => (
  <section
    className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 sm:px-6"
    aria-label="Productos en el carrito"
  >
    <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3 border-b border-[var(--border)]">
      <span className="text-xs font-medium text-[var(--text)] uppercase tracking-wide">
        Producto
      </span>
      <span className="text-xs font-medium text-[var(--text)] uppercase tracking-wide text-right pr-1">
        Subtotal
      </span>
    </div>

    {products.map((item) => (
      <CartItem key={item.product?._id ?? item._id} item={item} />
    ))}
  </section>
);

export default CartItemsList;