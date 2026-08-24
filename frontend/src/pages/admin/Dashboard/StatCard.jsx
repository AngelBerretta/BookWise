import { Link } from 'react-router-dom';
import { ArrowIcon } from './icons';

export const StatCard = ({ label, value, sublabel, icon, href, colorClass, delay }) => (
  <Link
    to={href}
    className="stat-card group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 overflow-hidden
               hover:border-[var(--accent-border)] hover:shadow-lg transition-all duration-300"
    style={{ animationDelay: delay }}
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colorClass.glow}`} />

    <div className="relative flex items-start justify-between gap-3">
      <div>
        <p className="text-[var(--text)] text-xs font-medium uppercase tracking-widest mb-2">{label}</p>
        <p className="text-4xl font-bold text-[var(--text-h)] tabular-nums leading-none">
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-[var(--text)] mt-2">{sublabel}</p>
        )}
      </div>
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${colorClass.icon}`}>
        {icon}
      </div>
    </div>

    <div className="relative mt-4 flex items-center gap-1 text-xs font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
      Gestionar <ArrowIcon />
    </div>
  </Link>
);

export const StatCardSkeleton = ({ delay }) => (
  <div
    className="stat-card rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 animate-pulse"
    style={{ animationDelay: delay }}
    aria-hidden="true"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-3 flex-1">
        <div className="h-2.5 w-20 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-9 w-16 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
        <div className="h-3 w-32 rounded" style={{ backgroundColor: 'var(--bg-container)' }} />
      </div>
      <div className="w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: 'var(--bg-container)' }} />
    </div>
    <div className="h-3 w-20 rounded mt-4" style={{ backgroundColor: 'var(--bg-container)' }} />
  </div>
);