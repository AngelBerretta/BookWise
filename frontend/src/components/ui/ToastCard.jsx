import { useEffect, useRef } from 'react';

/**
 * Card visual de un toast individual — sin portal ni posicionamiento propio.
 * El posicionamiento/stacking lo maneja <ToastContainer> en ToastContext.jsx.
 */
const ToastCard = ({ type = 'info', message, onClose, duration = 3000 }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timerRef.current);
  }, [onClose, duration]);

  const config = {
    success: {
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
      ),
      colors: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
      bar: 'bg-emerald-500',
    },
    error: {
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
        </svg>
      ),
      colors: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
      bar: 'bg-red-500',
    },
    warning: {
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
      ),
      colors: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
      bar: 'bg-amber-500',
    },
    info: {
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
        </svg>
      ),
      colors: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
      bar: 'bg-sky-500',
    },
  };

  const { icon, colors, bar } = config[type] ?? config.info;

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
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${bar}`}
        style={{ animation: `toastProgress ${duration}ms linear forwards`, width: '100%' }}
      />

      <div className="flex items-start gap-3 p-4 w-full">
        <span className="mt-0.5 opacity-90">{icon}</span>
        <p className="flex-1 text-sm font-medium leading-snug pr-2">{message}</p>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="mt-0.5 opacity-60 hover:opacity-100 transition-opacity shrink-0"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ToastCard;
