const ToastCloseButton = ({ onClose }) => (
  <button
    onClick={onClose}
    aria-label="Cerrar"
    className="mt-0.5 opacity-60 hover:opacity-100 transition-opacity shrink-0"
  >
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
      <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
    </svg>
  </button>
);

export default ToastCloseButton;