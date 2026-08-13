const BlogHeader = ({ search, setSearch }) => (
  <div className="border-b border-[var(--border-subtle)]" style={{ background: 'var(--bg-subtle)' }}>
    <div className="container py-16 text-center max-w-3xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
        Editorial
      </p>
      <h1 className="h1-editorial mb-4">El diario del curador</h1>
      <p className="text-[var(--text)] text-lg leading-relaxed mb-8">
        Reseñas, recomendaciones y reflexiones literarias desde los rincones de nuestras estanterías.
      </p>

      <div className="relative max-w-md mx-auto">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none"
        >
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
        <input
          type="search"
          placeholder="Buscar artículos…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border pl-11 pr-4 py-3 text-sm bg-[var(--bg-lowest)] text-[var(--text-h)] border-[var(--border)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
        />
      </div>
    </div>
  </div>
);

export default BlogHeader;