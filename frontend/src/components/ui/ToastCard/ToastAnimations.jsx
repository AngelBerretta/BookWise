/** Keyframes de entrada y barra de progreso — un <style> por card, como el original. */
const ToastAnimations = () => (
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
);

export default ToastAnimations;