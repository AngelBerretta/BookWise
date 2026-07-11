import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import Toast from '../ui/Toast';

/**
 * Formulario de registro — estilo BookWise editorial.
 * Lógica idéntica al original; solo cambia el markup visual.
 */
const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();

  const [fields, setFields] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Validación local ── */
  const validate = () => {
    const errors = {};
    if (!fields.username.trim()) {
      errors.username = 'El nombre es obligatorio.';
    } else if (fields.username.trim().length < 2) {
      errors.username = 'Mínimo 2 caracteres.';
    }
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
    if (!fields.confirmPassword) {
      errors.confirmPassword = 'Confirmá tu contraseña.';
    } else if (fields.password !== fields.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }
    return errors;
  };

  /* ── useForm wrapping register ── */
  const { handleSubmit, loading, error } = useForm(
    useCallback(
      async (data) => {
        const { confirmPassword, ...payload } = data;
        await register(payload);
        onSuccess?.();
      },
      [register, onSuccess]
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

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[clamp(0.45rem,1.6dvh,0.85rem)]">

        {/* ── Username ── */}
        <BwField
          id="username"
          label="Nombre de usuario"
          icon="person"
          error={fieldErrors.username}
        >
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoFocus
            placeholder="Tu nombre de usuario"
            value={fields.username}
            onChange={onChange}
            className="bw-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </BwField>

        {/* ── Email ── */}
        <BwField
          id="email"
          label="Email Address"
          icon="mail"
          error={fieldErrors.email}
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="reader@example.com"
            value={fields.email}
            onChange={onChange}
            className="bw-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </BwField>

        {/* ── Password ── */}
        <BwField
          id="password"
          label="Password"
          icon="lock"
          error={fieldErrors.password}
        >
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            value={fields.password}
            onChange={onChange}
            className="bw-input"
            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
          />
          <TogglePassword
            show={showPassword}
            onToggle={() => setShowPassword(v => !v)}
          />
        </BwField>

        {/* ── Confirm Password ── */}
        <BwField
          id="confirmPassword"
          label="Confirm Password"
          icon="lock_reset"
          error={fieldErrors.confirmPassword}
        >
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repetí tu contraseña"
            value={fields.confirmPassword}
            onChange={onChange}
            className="bw-input"
            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
          />
          <TogglePassword
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(v => !v)}
          />
        </BwField>

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
              Creando cuenta…
            </>
          ) : (
            <>
              Create Account
              <span
                className="material-symbols-outlined ml-2"
                style={{ fontSize: '18px' }}
              >
                arrow_forward
              </span>
            </>
          )}
        </button>

      </form>
    </>
  );
};

/* ─────────────────────────────────────────────
   Sub-componentes internos
───────────────────────────────────────────── */

/** Wrapper de campo con icono izquierdo + label + error */
const BwField = ({ id, label, icon, error, children }) => (
  <div className="flex flex-col gap-1">
    <label
      htmlFor={id}
      className="font-label text-xs font-medium uppercase tracking-wider"
      style={{ color: 'var(--bw-on-surface)' }}
    >
      {label}
    </label>
    <div className="relative">
      {/* Icono izquierdo */}
      <span
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                   pointer-events-none select-none"
        style={{ fontSize: '20px', color: 'var(--bw-outline)' }}
      >
        {icon}
      </span>
      {children}
    </div>
    {error && <FieldError msg={error} />}
  </div>
);

/** Botón toggle mostrar/ocultar contraseña */
const TogglePassword = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
    style={{ color: 'var(--bw-outline)' }}
    aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
  >
    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
      {show ? 'visibility' : 'visibility_off'}
    </span>
  </button>
);

/** Mensaje de error de campo */
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

export default RegisterForm;