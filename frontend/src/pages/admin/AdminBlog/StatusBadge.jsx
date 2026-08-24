const StatusBadge = ({ published }) => (
  <span className={[
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
    published
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      : 'bg-[var(--code-bg)] text-[var(--text)]',
  ].join(' ')}>
    <span className={`w-2 h-2 rounded-full ${published ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
    {published ? 'Publicado' : 'Borrador'}
  </span>
);

export default StatusBadge;