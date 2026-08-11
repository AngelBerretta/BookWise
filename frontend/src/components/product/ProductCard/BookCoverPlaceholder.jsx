const BookCoverPlaceholder = ({ title }) => (
  <div
    className="w-4/5 aspect-[3/4] rounded-md flex flex-col items-center justify-center gap-2 p-4 text-center
               group-hover:-translate-y-2 transition-transform duration-500"
    style={{ backgroundColor: 'var(--bg-container)' }}
  >
    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--text-muted)' }}>
      menu_book
    </span>
    <span className="font-body text-xs line-clamp-2" style={{ color: 'var(--text)' }}>
      {title}
    </span>
  </div>
);

export default BookCoverPlaceholder;