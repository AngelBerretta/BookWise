import Button from './Button';

/**
 * Estado vacío reutilizable.
 *
 * @param {string}          title        - Título principal
 * @param {string}          description  - Descripción secundaria
 * @param {React.ReactNode} icon         - Ícono SVG opcional (sobrescribe el por defecto)
 * @param {{ label: string, onClick: Function, variant?: string }} action - Acción opcional
 * @param {string}          className    - Clases adicionales para el wrapper
 */
const EmptyState = ({
  title       = 'Nada por aquí',
  description = '',
  icon,
  action,
  className   = '',
}) => {
  const defaultIcon = (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 text-[var(--text)] opacity-30"
    >
      {/* Libro abierto minimalista */}
      <rect x="8"  y="14" width="22" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <rect x="34" y="14" width="22" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <line x1="30" y1="14" x2="32" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="14" x2="32" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="24" x2="24" y2="24" stroke="currentColor" strokeWidth="2"  strokeLinecap="round" />
      <line x1="14" y1="30" x2="24" y2="30" stroke="currentColor" strokeWidth="2"  strokeLinecap="round" />
      <line x1="14" y1="36" x2="20" y2="36" stroke="currentColor" strokeWidth="2"  strokeLinecap="round" />
      <line x1="40" y1="24" x2="50" y2="24" stroke="currentColor" strokeWidth="2"  strokeLinecap="round" />
      <line x1="40" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="2"  strokeLinecap="round" />
      <line x1="40" y1="36" x2="44" y2="36" stroke="currentColor" strokeWidth="2"  strokeLinecap="round" />
    </svg>
  );

  return (
    <div
      className={[
        'flex flex-col items-center justify-center',
        'text-center py-16 px-6 gap-4',
        className,
      ].join(' ')}
    >
      {/* Ícono */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[var(--code-bg)]">
        {icon ?? defaultIcon}
      </div>

      {/* Textos */}
      <div className="flex flex-col gap-1.5 max-w-xs">
        <h3 className="text-base font-semibold text-[var(--text-h)]">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--text)] leading-relaxed">{description}</p>
        )}
      </div>

      {/* Acción opcional */}
      {action && (
        <Button
          variant={action.variant ?? 'primary'}
          size="md"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
