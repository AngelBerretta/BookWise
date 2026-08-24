const DashboardHeader = ({ user, greeting }) => (
  <div className="fade-up mb-10" style={{ animationDelay: '0ms' }}>
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 className="h1-admin leading-tight">
          {greeting},{' '}
          <span className="text-[var(--accent)]">
            {user?.username ?? 'Admin'}
          </span>
        </h1>
        <p className="mt-1.5 text-[var(--text)] text-sm">
          Todo bajo control — acá está el resumen de tu sitio.
        </p>
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-[var(--bg-subtle)] border border-[var(--border)]
                       text-xs font-medium text-[var(--text)] shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </span>
    </div>
  </div>
);

export default DashboardHeader;