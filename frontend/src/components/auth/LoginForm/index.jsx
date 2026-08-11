import FieldError from '../FieldError';
import AuthSubmitButton from '../AuthSubmitButton';
import useLoginForm from './useLoginForm';
import LoginPasswordField from './LoginPasswordField';

/** Formulario de inicio de sesión — estilo BookWise editorial. */
const LoginForm = ({ onSuccess }) => {
  const {
    fields, fieldErrors, showPassword, setShowPassword,
    onChange, onSubmit, loading, notifyForgotPassword,
  } = useLoginForm(onSuccess);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[clamp(0.6rem,2dvh,1rem)]">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-label text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--bw-on-surface)' }}
        >
          Correo electrónico
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
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

      <LoginPasswordField
        value={fields.password}
        onChange={onChange}
        error={fieldErrors.password}
        showPassword={showPassword}
        onToggleShow={() => setShowPassword((v) => !v)}
        onForgotPassword={notifyForgotPassword}
      />

      <AuthSubmitButton loading={loading} loadingLabel="Ingresando…" label="Ingresar a mi biblioteca" />
    </form>
  );
};

export default LoginForm;