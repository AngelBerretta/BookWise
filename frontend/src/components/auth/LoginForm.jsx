import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import Toast from '../ui/Toast';

/**
 * Formulario de inicio de sesión — estilo BookWise editorial.
 * Lógica idéntica al original; solo cambia el markup visual.
 */
const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();

  const [fields, setFields]           = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast]             = useState(null);
  const [infoToast, setInfoToast]     = useState(false);

  /* ── Validación local ── */
  const validate = () => {
    const errors = {};
    if (!fields.email.trim()) {
      errors.email = 'El email es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = 'Ingresá un email válido.';
    }
    if (!fields.password) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (fields.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres.';
    }
    return errors;
  };

  /* ── useForm wrapping login ── */
  const { handleSubmit, loading, error } = useForm(
    useCallback(
      async (data) => {
        const result = await login(data);
        onSuccess?.(result?.user);
      },
      [login, onSuccess]
    )
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    handleSubmit(fields);
  };

  const showToast = error && !toast;

  return (
    <>
      {showToast && (
        <Toast type="error" message={error} onClose={() => setToast(null)} />
      )}
      {infoToast && (
        <Toast
          type="info"
          message="La recuperación de contraseña estará disponible próximamente. Mientras tanto, probá el acceso demo para explorar la plataforma."
          onClose={() => setInfoToast(false)}
        />
      )}

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[clamp(0.6rem,2dvh,1rem)]">

        {/* ── Email ── */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-label text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--bw-on-surface)' }}
          >
            Correo electrónico
          </label>

          <div className="relative">
            {/* Icono izquierdo */}
            <span
              aria-hidden="true"
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                         pointer-events-none select-none"
              style={{ fontSize: '20px', color: 'var(--bw-outline)' }}
            >
              mail
            </span>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="lector@ejemplo.com"
              value={fields.email}
              onChange={onChange}
              className="bw-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {fieldErrors.email && <FieldError msg={fieldErrors.email} />}
        </div>

        {/* ── Password ── */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="font-label text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--bw-on-surface)' }}
            >
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setInfoToast(true)}
              className="font-label text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--bw-primary)' }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="relative">
            {/* Icono izquierdo */}
            <span
              aria-hidden="true"
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                         pointer-events-none select-none"
              style={{ fontSize: '20px', color: 'var(--bw-outline)' }}
            >
              lock
            </span>

            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={fields.password}
              onChange={onChange}
              className="bw-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />

            {/* Toggle mostrar/ocultar */}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors
                         focus:outline-none"
              style={{ color: 'var(--bw-outline)' }}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>

          {fieldErrors.password && <FieldError msg={fieldErrors.password} />}
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={loading}
          className="bw-btn-primary mt-1"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Ingresando…
            </>
          ) : (
            <>
              Ingresar a mi biblioteca
              <span aria-hidden="true" className="material-symbols-outlined ml-2" style={{ fontSize: '18px' }}>
                arrow_forward
              </span>
            </>
          )}
        </button>

      </form>
    </>
  );
};

/* ── Mensaje de error de campo ── */
const FieldError = ({ msg }) => (
  <p
    className="font-label text-xs flex items-center gap-1"
    style={{ color: 'var(--bw-error)' }}
  >
    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
      error
    </span>
    {msg}
  </p>
);

export default LoginForm;