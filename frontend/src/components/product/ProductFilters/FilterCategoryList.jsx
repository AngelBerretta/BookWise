import { PRODUCT_CATEGORIES } from '../../../utils/constants';
import CategoryItem from './CategoryItem';

const sectionTitleCls = 'font-headline text-lg italic tracking-tight';
const sectionTitleStyle = { color: 'var(--text-h)', fontFamily: "'Newsreader', Georgia, serif" };

const FilterCategoryList = ({ activeCategory, onSelect }) => (
  <div className="flex flex-col gap-4">
    <h3 className={sectionTitleCls} style={sectionTitleStyle}>Colecciones curadas</h3>
    <div className="flex flex-col gap-2">
      <CategoryItem
        label="Todas las colecciones"
        active={!activeCategory}
        onClick={() => onSelect('')}
      />
      {PRODUCT_CATEGORIES.map(({ value, label }) => (
        <CategoryItem
          key={value}
          label={label}
          active={activeCategory === value}
          onClick={() => onSelect(activeCategory === value ? '' : value)}
        />
      ))}
    </div>
  </div>
);

export default FilterCategoryList;