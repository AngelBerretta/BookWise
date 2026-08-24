import { Link } from 'react-router-dom';
import { ArrowIcon } from './icons';

const QuickLink = ({ to, label, description, icon, delay }) => (
  <Link
    to={to}
    className="quick-link flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4
               hover:border-[var(--accent-border)] hover:bg-[var(--bg-subtle)] hover:shadow-sm
               transition-all duration-200 group"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] shrink-0
                    group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-200">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[var(--text-h)] group-hover:text-[var(--accent)] transition-colors duration-150 truncate">
        {label}
      </p>
      <p className="text-xs text-[var(--text)] mt-0.5 leading-relaxed">{description}</p>
    </div>
    <div className="ml-auto text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-200 shrink-0">
      <ArrowIcon />
    </div>
  </Link>
);

export default QuickLink;