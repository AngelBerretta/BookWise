import { Link } from 'react-router-dom';
import LogoMark from '../../ui/icons/LogoMark';

const BookWiseLogo = () => (
  <Link to="/" className="group flex items-center gap-2.5 shrink-0" aria-label="BookWise — Inicio">
    <LogoMark size={34} className="shrink-0" />
    <span className="relative">
      <span
        className="text-xl sm:text-2xl font-bold tracking-tighter text-[var(--text-h)] transition-colors duration-200 group-hover:text-[var(--accent)]"
        style={{ fontFamily: 'var(--heading)' }}
      >
        BookWise
      </span>
      <span
        aria-hidden="true"
        className="absolute left-0 -bottom-0.5 h-[2px] w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-200 ease-out group-hover:scale-x-100"
      />
    </span>
  </Link>
);

export default BookWiseLogo;