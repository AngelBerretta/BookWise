import { Link, useNavigate } from 'react-router-dom';
import useWishlist from '../hooks/useWishlist';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/ui/EmptyState';
import { WishlistIcon } from '../components/ui/icons/NavIcons';

/**
 * Página de favoritos (wishlist).
 * Mismo tratamiento visual que Cart.jsx — es la otra "área personal" del sitio.
 */
const Wishlist = () => {
  const { wishlist, loading } = useWishlist();
  const navigate = useNavigate();

  /* ── Vacío ── */
  if (!loading && !wishlist.length) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="h1-admin mb-2">Mis favoritos</h1>
          <EmptyState
            icon={<WishlistIcon />}
            title="Todavía no guardaste nada"
            description="Tocá el ícono de marcador en cualquier producto para guardarlo acá."
            action={{ label: 'Explorar catálogo', onClick: () => navigate('/products'), variant: 'primary' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

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

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="h1-admin">Mis favoritos</h1>
          <p className="mt-1 text-sm text-[var(--text)]">
            {wishlist.length} {wishlist.length === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
        </div>

        <ProductGrid products={wishlist} loading={loading} />
      </div>
    </div>
  );
};

export default Wishlist;
