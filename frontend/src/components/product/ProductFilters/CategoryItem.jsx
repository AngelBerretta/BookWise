const CategoryItem = ({ label, active, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 text-left w-full transition-colors">
    <span
      className="w-1 h-4 rounded-full flex-shrink-0 transition-all duration-200"
      style={{
        backgroundColor: active ? 'var(--accent)' : 'transparent',
        border: active ? 'none' : '1px solid var(--border)',
      }}
    />
    <span
      className="font-body text-sm transition-colors"
      style={{ color: active ? 'var(--accent)' : 'var(--text)', fontWeight: active ? 500 : 400 }}
    >
      {label}
    </span>
  </button>
);

export default CategoryItem;