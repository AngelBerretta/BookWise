import { Link } from 'react-router-dom';

const ProductDetailBreadcrumb = ({ title }) => (
  <div
    className="flex items-center gap-2 text-xs pb-4 sm:pb-5 mb-4 sm:mb-5"
    style={{ borderBottom: '1px solid rgba(196,198,205,0.15)', color: 'var(--text-muted)' }}
  >
    <Link to="/" className="transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
      Inicio
    </Link>
    <span>/</span>
    <Link to="/products" className="transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
      Libros
    </Link>
    <span>/</span>
    <span className="line-clamp-1" style={{ color: 'var(--text)' }}>{title}</span>
  </div>
);

export default ProductDetailBreadcrumb;