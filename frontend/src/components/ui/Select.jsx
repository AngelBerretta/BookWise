/**
 * Select reutilizable de BookWise — mismo contrato visual que Input.jsx.
 *
 * @param {string}   label     - Etiqueta visible
 * @param {string}   error     - Mensaje de error
 * @param {string}   id        - Si se omite se genera desde label
 * @param {string}   className - Clases adicionales para el wrapper
 * @param {Array}    options   - [{ value, label }]
 * @param {string}   placeholder - Texto para la opción vacía (ej: "Seleccioná una categoría")
 * @param {object}   rest      - value, onChange, name, etc.
 */
const Select = ({
  label,
  error,
  id,
  className = '',
  options = [],
  placeholder,
  ...rest
}) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? 'select';

  const baseSelect = [
    'w-full rounded-lg border px-3 py-2.5 text-sm',
    'bg-[var(--bg)] text-[var(--text-h)]',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2',
    error
      ? 'border-red-500 focus:ring-red-400'
      : 'border-[var(--border)] focus:ring-[var(--accent)] focus:border-[var(--accent-border)]',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-[var(--text-h)]"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={baseSelect}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(({ value, label: optLabel }) => (
          <option key={value} value={value}>{optLabel}</option>
        ))}
      </select>

      {error && (
        <p
          id={`${selectId}-error`}
          role="alert"
          className="text-xs text-red-500 flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-3.5 h-3.5 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm7.25-3.25a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Zm.75 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;