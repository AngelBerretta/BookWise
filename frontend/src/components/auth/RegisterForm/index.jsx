import BwField from './BwField';
import TogglePassword from './TogglePassword';
import AuthSubmitButton from '../AuthSubmitButton';
import useRegisterForm from './useRegisterForm';

/** Formulario de registro — estilo BookWise editorial. */
const RegisterForm = ({ onSuccess }) => {
  const {
    fields, fieldErrors, loading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    onChange, onSubmit,
  } = useRegisterForm(onSuccess);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[clamp(0.45rem,1.6dvh,0.85rem)]">
      <BwField id="username" label="Nombre de usuario" icon="person" error={fieldErrors.username}>
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

      <BwField id="email" label="Correo electrónico" icon="mail" error={fieldErrors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="lector@ejemplo.com"
          value={fields.email}
          onChange={onChange}
          className="bw-input"
          style={{ paddingLeft: '2.5rem' }}
        />
      </BwField>

      <BwField id="password" label="Contraseña" icon="lock" error={fieldErrors.password}>
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
        <TogglePassword show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
      </BwField>

      <BwField id="confirmPassword" label="Confirmar contraseña" icon="lock_reset" error={fieldErrors.confirmPassword}>
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
        <TogglePassword show={showConfirmPassword} onToggle={() => setShowConfirmPassword((v) => !v)} />
      </BwField>

      <AuthSubmitButton loading={loading} loadingLabel="Creando cuenta…" label="Crear mi cuenta" />
    </form>
  );
};

export default RegisterForm;