import QuickLink from './QuickLink';
import { quickLinks } from './dashboardConfig';

const QuickLinksSection = () => (
  <>
    <div className="fade-up flex items-center gap-3 mb-5" style={{ animationDelay: '200ms' }}>
      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text)]">
        Acciones rápidas
      </span>
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {quickLinks.map((link) => (
        <QuickLink key={link.to} {...link} />
      ))}
    </div>
  </>
);

export default QuickLinksSection;