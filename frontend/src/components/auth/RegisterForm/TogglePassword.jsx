/** Botón toggle mostrar/ocultar contraseña */
const TogglePassword = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
    style={{ color: 'var(--bw-outline)' }}
    aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
  >
    <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '20px' }}>
      {show ? 'visibility' : 'visibility_off'}
    </span>
  </button>
);

export default TogglePassword;