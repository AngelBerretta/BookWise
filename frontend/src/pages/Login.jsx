import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

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
          px-8 md:px-16 lg:px-24 py-12
          shrink-0 h-full overflow-y-auto
          relative z-10
        "
        style={{
          backgroundColor: 'var(--bw-surface-container-lowest)',
          boxShadow: '0 12px 40px rgba(27,28,25,0.06)',
        }}
      >
        <div className="max-w-sm w-full mx-auto flex flex-col gap-6 pt-8">

          {/* ── Logo + encabezado ── */}
          <div className="text-center md:text-left space-y-4">
            <Link to="/" className="inline-block">
              <span
                className="text-3xl font-headline font-bold italic tracking-tighter"
                style={{ color: 'var(--bw-primary)' }}
              >
                BookWise
              </span>
            </Link>

            <h1
              className="font-headline font-medium tracking-tight leading-tight"
              style={{
                fontSize: 'clamp(1.4rem, 3vw, 1.875rem)',
                color: 'var(--bw-on-surface)',
                /* Sobreescribe el h1 global del index.css */
                fontFamily: "'Newsreader', Georgia, serif",
              }}
            >
              Welcome back to the library.
            </h1>

            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: 'var(--bw-on-surface-variant)' }}
            >
              Enter your credentials to access your curated collections
              and rare finds.
            </p>
          </div>

          {/* ── Tabs Log In / Register ── */}
          <div
            className="flex"
            style={{ borderBottom: '1px solid rgba(196,198,205,0.3)' }}
          >
            {/* Tab activo */}
            <button
              className="flex-1 pb-4 text-center font-label text-sm font-medium transition-colors"
              style={{
                color: 'var(--bw-primary)',
                borderBottom: `2px solid var(--bw-primary)`,
              }}
              aria-current="page"
            >
              Log In
            </button>

            {/* Tab inactivo → navega a /register */}
            <Link
              to="/register"
              className="flex-1 pb-4 text-center font-label text-sm font-medium transition-colors"
              style={{ color: 'var(--bw-on-surface-variant)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--bw-on-surface)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--bw-on-surface-variant)'}
            >
              Register
            </Link>
          </div>

          {/* ── Formulario ── */}
          <LoginForm onSuccess={handleLoginSuccess} />

          {/* ── Divisor ── */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full"
                style={{ borderTop: '1px solid rgba(196,198,205,0.2)' }}
              />
            </div>
            <div className="relative flex justify-center text-xs">
              <span
                className="px-4 font-label"
                style={{
                  backgroundColor: 'var(--bw-surface-container-lowest)',
                  color: 'var(--bw-on-surface-variant)',
                }}
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* ── Botones sociales ── */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton label="Google" icon={<GoogleIcon />} />
            <SocialButton label="GitHub"  icon={<GitHubIcon />} />
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════
          LADO DERECHO — Imagen + copy
      ══════════════════════════════════════ */}
      <div
        className="hidden md:flex flex-1 relative overflow-hidden
                   items-center justify-center"
        style={{ backgroundColor: 'var(--bw-surface-container-high)' }}
      >
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzgE8heq4-LuuL3VUaGAX4b19UKqrjUXSB8vAkB_Ei_eLmrNHuW98alDDWlHgJEQ_jZEnpXHdOvdjzmgZyJb2fo_wW6ucVJdwrR6TQc10HS2qdXaTic-_IprwOFofkX3DIpLPT0vuZ2K-uAQAZAhyxXrQWpS3Z6xCoYXRGeXVHKmMRbl5NmA3KKcOSyltKWVfdjQ9MLRFTy-hU_V_t5M16xEY0nVgKIuXZwvyQrfsRMMPNUODsPNSUrXD7lDhJdtNKu-7WcaS6Y6A"
            alt="Biblioteca con luz cálida y estantes de madera"
            className="w-full h-full object-cover"
            style={{ opacity: 0.8, mixBlendMode: 'multiply' }}
          />
          {/* Overlays de color */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'var(--bw-primary)',
              opacity: 0.70,
              mixBlendMode: 'overlay',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(4,22,39,0.90) 0%, rgba(4,22,39,0.40) 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Contenido sobre la imagen */}
        <div className="relative z-10 w-full max-w-2xl px-12 lg:px-24 text-left">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
            style={{
              backgroundColor: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.20)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--bw-secondary)', fontSize: '16px' }}
            >
              auto_awesome
            </span>
            <span
              className="font-label text-xs font-medium tracking-wide"
              style={{ color: 'var(--bw-on-primary)' }}
            >
              Curated Collection Update
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-headline font-semibold tracking-tight leading-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              color: 'var(--bw-on-primary)',
            }}
          >
            Discover stories that transcend{' '}
            <em style={{ color: 'var(--bw-tertiary-fixed-dim)' }}>time</em>{' '}
            and{' '}
            <em style={{ color: 'var(--bw-tertiary-fixed-dim)' }}>space</em>.
          </h2>

          {/* Subtítulo */}
          <p
            className="font-body text-lg leading-relaxed max-w-xl"
            style={{ color: 'var(--bw-primary-fixed-dim)' }}
          >
            Join an exclusive community of bibliophiles. Access rare editions,
            author manuscripts, and a meticulously organized catalog of human
            knowledge.
          </p>

          {/* Cita */}
          <div
            className="mt-16 pl-6"
            style={{ borderLeft: '2px solid rgba(238,189,142,0.50)' }}
          >
            <p
              className="font-headline italic text-lg md:text-xl leading-relaxed"
              style={{ color: 'var(--bw-on-primary)' }}
            >
              "A room without books is like a body without a soul."
            </p>
            <p
              className="font-label text-sm mt-2 tracking-widest uppercase"
              style={{ color: 'var(--bw-primary-fixed)' }}
            >
              — Marcus Tullius Cicero
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ── Botón social genérico ── */
const SocialButton = ({ label, icon }) => (
  <button
    type="button"
    className="flex justify-center items-center py-2.5 px-4
               font-label text-sm font-medium transition-colors rounded-lg"
    style={{
      border: '1px solid rgba(196,198,205,0.30)',
      backgroundColor: 'var(--bw-surface-container-lowest)',
      color: 'var(--bw-on-surface)',
    }}
    onMouseEnter={e =>
      (e.currentTarget.style.backgroundColor = 'var(--bw-surface-container-low)')
    }
    onMouseLeave={e =>
      (e.currentTarget.style.backgroundColor = 'var(--bw-surface-container-lowest)')
    }
  >
    {icon}
    {label}
  </button>
);

/* ── SVG Google ── */
const GoogleIcon = () => (
  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ── SVG GitHub ── */
const GitHubIcon = () => (
  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default Login;