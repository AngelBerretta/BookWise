import FieldError from '../FieldError';

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
      <span
        aria-hidden="true"
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ fontSize: '20px', color: 'var(--bw-outline)' }}
      >
        {icon}
      </span>
      {children}
    </div>
    {error && <FieldError msg={error} />}
  </div>
);

export default BwField;