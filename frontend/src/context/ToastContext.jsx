import { createContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ToastCard from '../components/ui/ToastCard';

const ToastContext = createContext(null);
let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * showToast({ type, message, duration })
   * Reemplaza al patrón anterior de `setToast({...})` local por componente.
   */
  const showToast = useCallback(({ type = 'info', message, duration = 3000 }) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    return id;
  }, []);

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
          aria-live="polite"
        >
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastCard
                type={t.type}
                message={t.message}
                duration={t.duration}
                onClose={() => removeToast(t.id)}
              />
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export default ToastContext;