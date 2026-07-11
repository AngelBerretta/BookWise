import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import AuthSidePanel from '../components/auth/AuthSidePanel';

const Login = () => {
  const { isAuthenticated, loading, user, login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(null); // 'user' | 'admin' | null

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleLoginSuccess = (user) => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/products', { replace: true });
    }
  };

  const handleDemoLogin = async (kind) => {
    setDemoLoading(kind);
    try {
      const credentials = kind === 'admin'
        ? { email: 'admin-demo@bookwise.com', password: 'Demo1234!' }
        : { email: 'demo@bookwise.com', password: 'Demo1234!' };
      const result = await login(credentials);
      handleLoginSuccess(result?.user);
    } catch {
      setDemoLoading(null);
    }
  };

  if (loading) return null;

  return (
    /* Contenedor raíz: ocupa toda la pantalla, sin navbar */
    <div className="login-page-root">

      {/* ══════════════════════════════════════
          LADO IZQUIERDO — Formulario
      ══════════════════════════════════════ */}
      <div
        className="
          w-full md:w-1/2 lg:w-5/12 xl:w-[480px]
          flex flex-col justify-center
          px-8 md:px-16 lg:px-24
          shrink-0 h-full overflow-y-auto hide-scrollbar
          relative z-10
        "
        style={{
          backgroundColor: 'var(--bw-surface-container-lowest)',
          boxShadow: '0 12px 40px rgba(27,28,25,0.06)',
          paddingTop: 'clamp(0.75rem, 3dvh, 2rem)',
          paddingBottom: 'clamp(0.75rem, 3dvh, 2rem)',
        }}
      >
        <div className="max-w-sm w-full mx-auto flex flex-col gap-[clamp(0.6rem,2dvh,1.25rem)]">

          {/* ── Logo + encabezado ── */}
          <div className="text-center md:text-left space-y-[clamp(0.35rem,1.2dvh,0.75rem)]">
            <Link to="/" className="inline-block">
              <span
                className="text-2xl font-headline font-bold italic tracking-tighter"
                style={{ color: 'var(--bw-primary)' }}
              >
                BookWise
              </span>
            </Link>

            <h1
              className="font-headline font-medium tracking-tight leading-tight"
              style={{
                fontSize: 'clamp(1.15rem, 2.4vw, 1.5rem)',
                color: 'var(--bw-on-surface)',
                fontFamily: "'Newsreader', Georgia, serif",
              }}
            >
              Bienvenido de nuevo a la biblioteca.
            </h1>

            <p
              className="auth-subtitle font-body text-sm leading-relaxed"
              style={{ color: 'var(--bw-on-surface-variant)' }}
            >
              Ingresá tus credenciales para acceder a tus colecciones
              curadas y hallazgos únicos.
            </p>
          </div>


          {/* ── Tabs Log In / Register ── */}
          <div
            className="flex"
            style={{ borderBottom: '1px solid rgba(196,198,205,0.3)' }}
          >
            <button
              className="flex-1 pb-2 text-center font-label text-sm font-medium transition-colors"
              style={{
                color: 'var(--bw-primary)',
                borderBottom: `2px solid var(--bw-primary)`,
              }}
              aria-current="page"
            >
              Iniciar sesión
            </button>

            <Link
              to="/register"
              className="flex-1 pb-2 text-center font-label text-sm font-medium transition-colors"
              style={{ color: 'var(--bw-on-surface-variant)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--bw-on-surface)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--bw-on-surface-variant)'}
            >
              Registrarse
            </Link>
          </div>

          {/* ── Acceso rápido — cuentas demo para portfolio ── */}
          <div
            className="demo-quick-access rounded-lg p-2.5 flex flex-col gap-1.5"
            style={{ backgroundColor: 'var(--bw-surface-container-low)', border: '1px solid rgba(196,198,205,0.3)' }}
          >
            <p className="font-label text-xs" style={{ color: 'var(--bw-on-surface-variant)' }}>
              ¿Solo estás explorando? Entrá sin registrarte:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={!!demoLoading}
                className="flex-1 font-label text-xs font-medium py-1.5 rounded-lg border transition-colors disabled:opacity-50"
                style={{ borderColor: 'var(--bw-outline-variant)', color: 'var(--bw-on-surface)' }}
              >
                {demoLoading === 'user' ? 'Ingresando…' : 'Ver como lector'}
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={!!demoLoading}
                className="flex-1 font-label text-xs font-medium py-1.5 rounded-lg text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--bw-primary)' }}
              >
                {demoLoading === 'admin' ? 'Ingresando…' : 'Ver como admin'}
              </button>
            </div>
          </div>

          {/* ── Formulario ── */}
          <LoginForm onSuccess={handleLoginSuccess} />

        </div>
      </div>

      {/* ══════════════════════════════════════
          LADO DERECHO — Panel decorativo
      ══════════════════════════════════════ */}
      <AuthSidePanel />
    </div>
  );
};

export default Login;