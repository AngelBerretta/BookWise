import { Link } from 'react-router-dom';

const tabActiveStyle = { color: 'var(--bw-primary)', borderBottom: '2px solid var(--bw-primary)' };
const tabInactiveStyle = { color: 'var(--bw-on-surface-variant)' };
const onEnter = (e) => { e.currentTarget.style.color = 'var(--bw-on-surface)'; };
const onLeave = (e) => { e.currentTarget.style.color = 'var(--bw-on-surface-variant)'; };

const AuthTabs = ({ active }) => (
  <div className="flex" style={{ borderBottom: '1px solid rgba(196,198,205,0.3)' }}>
    {active === 'login' ? (
      <button className="flex-1 pb-2 text-center font-label text-sm font-medium transition-colors" style={tabActiveStyle} aria-current="page">
        Iniciar sesión
      </button>
    ) : (
      <Link to="/login" className="flex-1 pb-2 text-center font-label text-sm font-medium transition-colors" style={tabInactiveStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        Iniciar sesión
      </Link>
    )}

    {active === 'register' ? (
      <button className="flex-1 pb-2 text-center font-label text-sm font-medium transition-colors" style={tabActiveStyle} aria-current="page">
        Registrarse
      </button>
    ) : (
      <Link to="/register" className="flex-1 pb-2 text-center font-label text-sm font-medium transition-colors" style={tabInactiveStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        Registrarse
      </Link>
    )}
  </div>
);

export default AuthTabs;