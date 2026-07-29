import { useNavigate } from 'react-router-dom';

const STEPS = [
  { key: 'cart', label: 'Carrito', path: '/cart' },
  { key: 'shipping', label: 'Envío', path: '/checkout/shipping' },
  { key: 'payment', label: 'Pago', path: '/checkout/payment' },
  { key: 'confirmation', label: 'Confirmación', path: '/checkout/confirmation' },
];

/**
 * Stepper de progreso del checkout: Carrito → Envío → Pago → Confirmación.
 *
 * Solo se puede volver a un paso YA completado haciendo click — nunca
 * adelantarse (evita, por ejemplo, entrar a /checkout/payment sin haber
 * creado el pedido todavía).
 *
 * @param {{ currentStep: 1|2|3|4 }} props
 */
const CheckoutStepper = ({ currentStep }) => {
  const navigate = useNavigate();

  return (
    <nav aria-label="Progreso de la compra" className="w-full mb-8 select-none">
      <ol className="flex items-start">
        {STEPS.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = isCompleted;
          const isLast = idx === STEPS.length - 1;

          return (
            <li
              key={step.key}
              className={`flex items-center ${isLast ? '' : 'flex-1'}`}
            >
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && navigate(step.path)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    'text-xs font-semibold border-2 transition-colors duration-200',
                    isCompleted
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--bg)] cursor-pointer hover:opacity-80'
                      : isCurrent
                      ? 'bg-[var(--bg)] border-[var(--accent)] text-[var(--accent)]'
                      : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] cursor-default',
                  ].join(' ')}
                >
                  {isCompleted ? (
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                      <path
                        fillRule="evenodd"
                        d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </button>
                <span
                  className={[
                    'text-[11px] sm:text-xs font-medium text-center leading-tight whitespace-nowrap',
                    isCurrent ? 'text-[var(--text-h)]' : 'text-[var(--text-muted)]',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className="flex-1 h-[2px] mx-1.5 sm:mx-3 rounded-full -mt-5"
                  style={{ backgroundColor: isCompleted ? 'var(--accent)' : 'var(--border)' }}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutStepper;
