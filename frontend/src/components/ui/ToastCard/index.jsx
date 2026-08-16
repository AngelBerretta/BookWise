import useToastTimer from './useToastTimer';
import TOAST_CONFIG from './toastConfig';
import ToastProgressBar from './ToastProgressBar';
import ToastCloseButton from './ToastCloseButton';
import ToastAnimations from './ToastAnimations';

/**
 * Card visual de un toast individual — sin portal ni posicionamiento propio.
 * El posicionamiento/stacking lo maneja <ToastContainer> en ToastContext.jsx.
 */
const ToastCard = ({ type = 'info', message, onClose, duration = 3000 }) => {
  useToastTimer(onClose, duration);

  const { icon, colors, bar } = TOAST_CONFIG[type] ?? TOAST_CONFIG.info;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'relative flex items-start gap-3',
        'min-w-[280px] max-w-sm w-full',
        'rounded-xl border shadow-lg overflow-hidden',
        colors,
      ].join(' ')}
      style={{ animation: 'toastIn 0.25s ease-out' }}
    >
      <ToastProgressBar bar={bar} duration={duration} />

      <div className="flex items-start gap-3 p-4 w-full">
        <span className="mt-0.5 opacity-90">{icon}</span>
        <p className="flex-1 text-sm font-medium leading-snug pr-2">{message}</p>
        <ToastCloseButton onClose={onClose} />
      </div>

      <ToastAnimations />
    </div>
  );
};

export default ToastCard;