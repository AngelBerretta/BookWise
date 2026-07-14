import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import AuthSidePanel from '../components/auth/AuthSidePanel';

const Register = () => {
  const [registered, setRegistered] = useState(false);

  /* ── Estado: registro exitoso ── */
  if (registered) {
    return (
      <div className="login-page-root">

        {/* Panel izquierdo — éxito */}
        <div
          className="w-full md:w-1/2 lg:w-5/12 xl:w-[480px]
                     auth-panel
                     px-8 md:px-16 lg:px-24
                     shrink-0 max-h-full self-center md:self-auto md:h-full overflow-y-auto hide-scrollbar relative z-10"
          style={{
            backgroundColor: 'var(--bw-surface-container-lowest)',
            boxShadow: '0 12px 40px rgba(27,28,25,0.06)',
          }}
        >
          <div className="max-w-sm w-full mx-auto flex flex-col items-center gap-6 text-center">

            {/* Ícono éxito */}
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--secondary-bg)' }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '32px', color: 'var(--bw-secondary)' }}
              >
                mark_email_read
              </span>
            </div>

            <div className="space-y-2">
              <h2
                className="font-headline font-medium text-2xl"
                style={{ color: 'var(--bw-on-surface)' }}
              >
                ¡Cuenta creada!
              </h2>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: 'var(--bw-on-surface-variant)' }}
              >
                Revisá tu email para verificar tu cuenta.
                <br />
                El link expira en 24 horas.
              </p>
            </div>

            <div className="w-full flex flex-col gap-3 mt-4">
              <Link to="/login" className="bw-btn-primary">
                Ir al inicio de sesión
                <span className="material-symbols-outlined ml-2" style={{ fontSize: '18px' }}>
                  arrow_forward
                </span>
              </Link>
              <button
                onClick={() => setRegistered(false)}
                className="font-label text-sm transition-colors"
                style={{ color: 'var(--bw-on-surface-variant)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--bw-on-surface)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--bw-on-surface-variant)'}
              >
                Volver al registro
              </button>
            </div>

          </div>

          {/* Pie de marca — solo mobile, ver nota en Login.jsx */}
          <p
            className="md:hidden mt-[clamp(1.5rem,5dvh,3rem)] text-center font-label text-xs"
            style={{ color: 'var(--bw-outline)' }}
          >
            "Una habitación sin libros es como un cuerpo sin alma." — Cicerón
          </p>
        </div>

        {/* Panel derecho — igual que login */}
        <AuthSidePanel />
      </div>
    );
  }

  /* ── Estado: formulario de registro ── */
  return (
    <div className="login-page-root">

      {/* ══════════════════════════════════════
          LADO IZQUIERDO — Formulario
      ══════════════════════════════════════ */}
      <div
        className="w-full md:w-1/2 lg:w-5/12 xl:w-[480px]
                   auth-panel
                   px-8 md:px-16 lg:px-24
                   shrink-0 max-h-full self-center md:self-auto md:h-full overflow-y-auto hide-scrollbar relative z-10"
        style={{
          backgroundColor: 'var(--bw-surface-container-lowest)',
          boxShadow: '0 12px 40px rgba(27,28,25,0.06)',
        }}
      >
        <div className="max-w-sm w-full mx-auto flex flex-col gap-[clamp(0.5rem,1.8dvh,1rem)]">

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
              Sumate a la biblioteca.
            </h1>

            <p
              className="auth-subtitle font-body text-sm leading-relaxed"
              style={{ color: 'var(--bw-on-surface-variant)' }}
            >
              Creá tu cuenta y empezá a descubrir colecciones únicas.
            </p>
          </div>

          {/* ── Tabs Log In / Register ── */}
          <div
            className="flex"
            style={{ borderBottom: '1px solid rgba(196,198,205,0.3)' }}
          >
            <Link
              to="/login"
              className="flex-1 pb-2 text-center font-label text-sm font-medium transition-colors"
              style={{ color: 'var(--bw-on-surface-variant)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--bw-on-surface)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--bw-on-surface-variant)'}
            >
              Iniciar sesión
            </Link>

            {/* Tab activo */}
            <button
              className="flex-1 pb-2 text-center font-label text-sm font-medium transition-colors"
              style={{
                color: 'var(--bw-primary)',
                borderBottom: `2px solid var(--bw-primary)`,
              }}
              aria-current="page"
            >
              Registrarse
            </button>
          </div>

          {/* ── Formulario ── */}
          <RegisterForm onSuccess={() => setRegistered(true)} />

        </div>

        {/* Pie de marca — solo mobile, ver nota en Login.jsx */}
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
      <AuthSidePanel
        headline={
          <>
            Empezá tu propia{' '}
            <em style={{ color: 'var(--bw-tertiary-fixed-dim)' }}>colección</em>{' '}
            hoy.
          </>
        }
        subtitle="Creá tu cuenta gratis y accedé a un catálogo curado, reseñas editoriales y guardá tus próximas lecturas en un solo lugar."
        badge="Unite a la comunidad"
      />
    </div>
  );
};

export default Register;