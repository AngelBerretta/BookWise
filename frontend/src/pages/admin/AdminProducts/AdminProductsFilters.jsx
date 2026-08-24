import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { STOCK_OPTIONS } from './adminProductsConfig';
import { PRODUCT_CATEGORIES } from '../../../utils/constants';

const AdminProductsFilters = ({
  searchInputRef, search, setSearch,
  category, setCategory, stock, setStock,
  hasActiveFilters, clearFilters,
}) => (
  <div className="mb-6 flex flex-wrap items-end gap-3">
    <div className="w-full sm:w-64">
      <Input
        ref={searchInputRef}
        type="search"
        placeholder="Buscar por título o descripción… ( / )"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
    <div className="w-full sm:w-48">
      <Select
        placeholder="Todas las categorías"
        options={PRODUCT_CATEGORIES}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filtrar por categoría"
      />
    </div>
    <div className="w-full sm:w-44">
      <Select
        placeholder="Todo el stock"
        options={STOCK_OPTIONS}
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        aria-label="Filtrar por stock"
      />
    </div>
    {hasActiveFilters && (
      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Limpiar filtros
      </Button>
    )}
  </div>
);

export default AdminProductsFilters;