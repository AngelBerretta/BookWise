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
          auth-panel
          px-8 md:px-16 lg:px-24
          shrink-0 max-h-full self-center md:self-auto md:h-full overflow-y-auto hide-scrollbar
          relative z-10
        "
        style={{
          backgroundColor: 'var(--bw-surface-container-lowest)',
          boxShadow: '0 12px 40px rgba(27,28,25,0.06)',
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
            className="demo-quick-access rounded-xl p-2.5 flex flex-col gap-2"
            style={{
              backgroundColor: 'var(--bw-surface-container-low)',
              border: '1px solid rgba(196,198,205,0.3)',
            }}
          >
            <p
              className="font-label text-xs leading-snug flex items-center gap-1"
              style={{ color: 'var(--bw-on-surface-variant)' }}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined"
                style={{ fontSize: '14px', color: 'var(--bw-primary)' }}
              >
                bolt
              </span>
              Acceso demo con un clic, sin registrarte:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {/* ── Lector ── */}
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={!!demoLoading}
                aria-busy={demoLoading === 'user'}
                className="demo-role-btn demo-role-btn--outline flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: 'var(--bw-outline-variant)', color: 'var(--bw-on-surface)' }}
              >
                {demoLoading === 'user' ? (
                  <DemoSpinner small />
                ) : (
                  <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--bw-primary)' }}>
                    person
                  </span>
                )}
                <span className="font-label text-xs font-medium">
                  {demoLoading === 'user' ? 'Ingresando…' : 'Lector'}
                </span>
              </button>

              {/* ── Administrador ── */}
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={!!demoLoading}
                aria-busy={demoLoading === 'admin'}
                className="demo-role-btn demo-role-btn--filled flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--bw-primary) 0%, var(--bw-primary-container) 100%)',
                  boxShadow: '0 2px 8px rgba(4, 22, 39, 0.25)',
                }}
              >
                {demoLoading === 'admin' ? (
                  <DemoSpinner small light />
                ) : (
                  <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    admin_panel_settings
                  </span>
                )}
                <span className="font-label text-xs font-medium">
                  {demoLoading === 'admin' ? 'Ingresando…' : 'Administrador'}
                </span>
              </button>
            </div>
          </div>

          {/* ── Formulario ── */}
          <LoginForm onSuccess={handleLoginSuccess} />

        </div>

        {/* Pie de marca — solo mobile. Ancla el bloque al fondo cuando
            sobra alto en pantallas muy altas, en vez de dejar un hueco
            ciego repartido arriba y abajo. */}
        <p
          className="md:hidden mt-[clamp(1.5rem,5dvh,3rem)] text-center font-label text-xs"
          style={{ color: 'var(--bw-outline)' }}
        >
          "Una habitación sin libros es como un cuerpo sin alma." — Cicerón
        </p>
      </div>

      {/* ══════════════════════════════════════
          LADO DERECHO — Panel decorativo
      ══════════════════════════════════════ */}
      <AuthSidePanel />
    </div>
  );
};

/* ── Spinner compacto para los botones de acceso demo ── */
const DemoSpinner = ({ light = false, small = false }) => (
  <svg
    className={small ? 'animate-spin h-[18px] w-[18px]' : 'animate-spin h-5 w-5'}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ color: light ? '#ffffff' : 'var(--bw-primary)' }}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

export default Login;