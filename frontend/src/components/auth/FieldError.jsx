/** Mensaje de error de campo — compartido por LoginForm y RegisterForm. */
const FieldError = ({ msg }) => (
  <p className="font-label text-xs flex items-center gap-1" style={{ color: 'var(--bw-error)' }}>
    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
      error
    </span>
    {msg}
  </p>
);

export default FieldError;