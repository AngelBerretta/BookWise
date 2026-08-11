import { useState, useRef, useEffect } from 'react';

/**
 * Estado + comportamiento de un dropdown flotante: se cierra al hacer
 * click afuera o al presionar Escape. Usado por CartMenu y WishlistMenu.
 */
const useDropdownMenu = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  return { open, rootRef, close, toggle };
};

export default useDropdownMenu;