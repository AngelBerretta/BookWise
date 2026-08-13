/** Switch "Publicado / Borrador". */
const PostPublishedToggle = ({ checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none group">
    <div className="relative">
      <input
        type="checkbox"
        name="published"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className={[
        'w-10 h-5 rounded-full border transition-colors duration-200',
        'peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)]',
        'bg-[var(--code-bg)] border-[var(--border)]',
      ].join(' ')} />
      <div className={[
        'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
        'peer-checked:translate-x-5',
      ].join(' ')} />
    </div>
    <span className="text-sm font-medium text-[var(--text-h)]">
      {checked ? 'Publicado' : 'Borrador'}
    </span>
  </label>
);

export default PostPublishedToggle;