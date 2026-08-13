import Badge from '../../components/ui/Badge';

const ProductDetailHeader = ({ title, author, category }) => (
  <>
    <div className="flex items-center gap-3 mb-6 text-sm flex-wrap" style={{ color: 'var(--text)' }}>
      {category && <Badge category={category} />}
      {author && (
        <>
          <span style={{ color: 'var(--border)' }}>•</span>
          <span className="text-sm" style={{ color: 'var(--text)' }}>{author}</span>
        </>
      )}
    </div>

    <h1 className="h1-editorial mb-4">{title}</h1>

    {author && (
      <p className="text-xl font-headline italic mb-8" style={{ color: 'var(--text)' }}>
        por {author}
      </p>
    )}
  </>
);

export default ProductDetailHeader;