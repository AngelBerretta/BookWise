import { PRODUCT_CATEGORIES } from '../../utils/constants';

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text)', letterSpacing: '0.1em' }}>
      {label}
    </p>
    <p className="text-sm font-medium" style={{ color: 'var(--text-h)' }}>
      {value}
    </p>
  </div>
);

/** Descripción + grid de detalles (categoría, publicación, páginas, stock). */
const ProductDetailMeta = ({ description, category, publicationDate, pages, outOfStock }) => (
  <>
    {description && (
      <div className="mb-8 leading-relaxed text-base" style={{ color: 'var(--text)' }}>
        <p>{description}</p>
      </div>
    )}

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6" style={{ borderTop: '1px solid rgba(196,198,205,0.15)' }}>
      {category && (
        <DetailItem
          label="Categoría"
          value={PRODUCT_CATEGORIES.find((c) => c.value === category)?.label ?? category}
        />
      )}
      {publicationDate && <DetailItem label="Publicación" value={publicationDate} />}
      {pages && <DetailItem label="Páginas" value={`${pages} págs.`} />}
      {!publicationDate && !pages && (
        <DetailItem label="Disponibilidad" value={outOfStock ? 'Sin stock' : 'En stock'} />
      )}
    </div>
  </>
);

export default ProductDetailMeta;