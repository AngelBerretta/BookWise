import Button from '../../../components/ui/Button';

const AdminProductsHeader = ({ totalDocs, onCreate }) => (
  <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
    <div>
      <h1 className="h1-admin">Productos</h1>
      <p className="mt-1 text-sm text-[var(--text)]">{totalDocs} en el catálogo</p>
    </div>
    <Button variant="primary" onClick={onCreate}>
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
      </svg>
      Nuevo producto
    </Button>
  </div>
);

export default AdminProductsHeader;