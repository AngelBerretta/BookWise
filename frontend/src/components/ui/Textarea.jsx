/**
 * Textarea reutilizable de BookWise — mismo contrato visual que Input.jsx.
 *
 * @param {string}  label     - Etiqueta visible
 * @param {string}  error     - Mensaje de error
 * @param {string}  id        - Si se omite se genera desde label
 * @param {string}  className - Clases adicionales para el wrapper
 * @param {number}  rows      - Filas visibles (default 4)
 * @param {boolean} mono      - Usa fuente monoespaciada (para contenido tipo markdown/código)
 * @param {object}  rest      - value, onChange, name, placeholder, etc.
 */
const Textarea = ({
  label,
  error,
  id,
  className = '',
  rows = 4,
  mono = false,
  ...rest
}) => {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? 'textarea';

  const baseTextarea = [
    'w-full rounded-lg border px-3 py-2.5 text-sm resize-y',
    'bg-[var(--bg)] text-[var(--text-h)]',
    'placeholder:text-[var(--text)] placeholder:opacity-60',
    mono ? 'font-[var(--mono)] placeholder:font-[var(--sans)]' : '',
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
          htmlFor={textareaId}
          className="text-sm font-medium text-[var(--text-h)]"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={baseTextarea}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...rest}
      />

      {error && (
        <p
          id={`${textareaId}-error`}
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

export default Textarea;