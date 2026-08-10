import WishlistItem from './WishlistItem';
import WishlistItemSkeleton from './WishlistItemSkeleton';
import Card from '../ui/Card';

/**
 * Vista de lista (no grid) para la wishlist — más escaneable en mobile
 * que las cards grandes del catálogo, sobre todo con varios ítems.
 */
const WishlistList = ({ wishlist, loading }) => {
  if (loading) {
    return (
      <Card noPadding className="px-4 sm:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <WishlistItemSkeleton key={i} />
        ))}
      </Card>
    );
  }

  return (
    <Card noPadding className="px-4 sm:px-6">
      {wishlist.map((product) => (
        <WishlistItem key={product._id} product={product} />
      ))}
    </Card>
  );
};

export default WishlistList;