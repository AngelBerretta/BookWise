import { useEffect, useRef } from 'react';

/** Cierra con Escape + foco al primer link al abrir (accesibilidad) */
const useMobileMenu = (open, onClose) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector('a, button')?.focus();
  }, [open]);

  return panelRef;
};

export default useMobileMenu;