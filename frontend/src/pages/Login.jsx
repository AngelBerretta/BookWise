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
              Bienvenido de nuevo a la biblioteca.
            </h1>

            <p
              className="font-body text-sm leading-relaxed"
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
            {/* Tab activo */}
            <button
              className="flex-1 pb-4 text-center font-label text-sm font-medium transition-colors"
              style={{
                color: 'var(--bw-primary)',
                borderBottom: `2px solid var(--bw-primary)`,
              }}
              aria-current="page"
            >
              Iniciar sesión
            </button>

            {/* Tab inactivo → navega a /register */}
            <Link
              to="/register"
              className="flex-1 pb-4 text-center font-label text-sm font-medium transition-colors"
              style={{ color: 'var(--bw-on-surface-variant)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--bw-on-surface)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--bw-on-surface-variant)'}
            >
              Registrarse
            </Link>
          </div>

          {/* ── Formulario ── */}
          <LoginForm onSuccess={handleLoginSuccess} />

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
              Novedades de la colección
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
            Descubrí historias que trascienden el{' '}
            <em style={{ color: 'var(--bw-tertiary-fixed-dim)' }}>tiempo</em>{' '}
            y el{' '}
            <em style={{ color: 'var(--bw-tertiary-fixed-dim)' }}>espacio</em>.
          </h2>

          {/* Subtítulo */}
          <p
            className="font-body text-lg leading-relaxed max-w-xl"
            style={{ color: 'var(--bw-primary-fixed-dim)' }}
          >
            Sumate a una comunidad exclusiva de bibliófilos. Accedé a ediciones
            raras, manuscritos de autor y un catálogo meticulosamente
            organizado del conocimiento humano.
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
              "Una habitación sin libros es como un cuerpo sin alma."
            </p>
            <p
              className="font-label text-sm mt-2 tracking-widest uppercase"
              style={{ color: 'var(--bw-primary-fixed)' }}
            >
              — Marco Tulio Cicerón
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;