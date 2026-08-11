import FieldError from '../FieldError';

const LoginPasswordField = ({
  value, onChange, error, showPassword, onToggleShow, onForgotPassword,
}) => (
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
        onClick={onForgotPassword}
        className="font-label text-xs font-medium transition-opacity hover:opacity-70"
        style={{ color: 'var(--bw-primary)' }}
      >
        ¿Olvidaste tu contraseña?
      </button>
    </div>

    <div className="relative">
      <span
        aria-hidden="true"
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
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
        value={value}
        onChange={onChange}
        className="bw-input"
        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
        style={{ color: 'var(--bw-outline)' }}
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '20px' }}>
          {showPassword ? 'visibility' : 'visibility_off'}
        </span>
      </button>
    </div>

    {error && <FieldError msg={error} />}
  </div>
);

export default LoginPasswordField;