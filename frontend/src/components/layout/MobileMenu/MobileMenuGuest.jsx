import { Link } from 'react-router-dom';

const MobileMenuGuest = ({ onNavigate }) => (
  <div className="flex flex-col gap-2">
    <Link
      to="/login"
      onClick={onNavigate}
      className="w-full text-center px-4 py-3 rounded-xl text-base font-medium text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors"
    >
      Iniciar sesión
    </Link>
    <Link
      to="/register"
      onClick={onNavigate}
      className="w-full text-center px-4 py-3 rounded-xl text-base font-medium bg-[var(--brand)] text-white hover:brightness-110 transition-all"
    >
      Registrarse
    </Link>
  </div>
);

export default MobileMenuGuest;