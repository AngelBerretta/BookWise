import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal genérico reutilizable.
 * Cierra al presionar Escape o clickear el overlay.
 *
 * @param {{
 *   title: string,
 *   children: React.ReactNode,
 *   onClose: Function,
 *   size?: 'md'|'lg'|'xl'
 * }} props
 */
const Modal = ({ title, children, onClose, size = 'lg', footer = null }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const maxW = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];

  return createPortal(
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        className={[
          'relative w-full rounded-2xl',
          'bg-[var(--bg)] border border-[var(--border)]',
          'shadow-[var(--shadow-lg)]',
          'flex flex-col max-h-[90vh]',
          maxW,
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border)] shrink-0">
          <h2 className="text-lg font-semibold text-[var(--text-h)]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)] transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {children}
        </div>

        {/* Footer opcional — fijo, no scrollea con el contenido */}
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border)] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;