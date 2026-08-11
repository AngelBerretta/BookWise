import { useState } from 'react';
import { Link } from 'react-router-dom';
import useProductCardActions from '../../product/ProductCard/useProductCardActions';
import WishlistItemThumbnail from './WishlistItemThumbnail';
import WishlistItemActions from './WishlistItemActions';

/**
 * Fila de un ítem dentro de la wishlist. Imagen chica + info al costado
 * (como CartItem), pero con precio y CTA apilados verticalmente en vez
 * de repartidos en el ancho de la fila — el bloque de acción queda
 * angosto y compacto, no estirado.
 *
 * @param {{ product: Object }} props
 */
const WishlistItem = ({ product }) => {
  const {
    adding: addingToCart,
    handleAddToCart,
    toggleWishlist,
    showToast,
  } = useProductCardActions(product);

  const [removing, setRemoving] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { _id, title, author, price, thumbnails, url, stock } = product ?? {};
  const thumbnail = thumbnails?.[0] || url || '';

  const outOfStock = stock === 0;
  const lowStock = !outOfStock && stock > 0 && stock <= 3;

  const handleRemove = () => {
    setRemoving(true);
    setIsLeaving(true);
  };

  const handleExitEnd = async (e) => {
    if (e.target !== e.currentTarget || !isLeaving) return;
    try {
      await toggleWishlist(_id, title);
    } catch (err) {
      const msg = err?.message
        || 'No pudimos quitar el producto de tus favoritos. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
      setIsLeaving(false);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <article
      className={`cart-item-exit cart-item-exit--tall flex gap-4 py-6 border-b border-[var(--border)] last:border-b-0 ${isLeaving ? 'is-leaving' : ''}`}
      onTransitionEnd={handleExitEnd}
    >
      <WishlistItemThumbnail productId={_id} title={title} thumbnail={thumbnail} />

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="min-w-0">
          <Link
            to={`/products/${_id}`}
            className="text-sm sm:text-base font-semibold text-[var(--text-h)] hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug"
          >
            {title}
          </Link>
          {author && (
            <p className="text-xs sm:text-sm text-[var(--text)] mt-0.5 truncate">{author}</p>
          )}
        </div>

        {(outOfStock || lowStock) && (
          <p className={`text-xs ${outOfStock ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
            {outOfStock ? 'Sin stock' : `¡Últimas ${stock}!`}
          </p>
        )}

        <WishlistItemActions
          price={price}
          outOfStock={outOfStock}
          addingToCart={addingToCart}
          removing={removing}
          onAddToCart={handleAddToCart}
          onRemove={handleRemove}
        />
      </div>
    </article>
  );
};

export default WishlistItem;