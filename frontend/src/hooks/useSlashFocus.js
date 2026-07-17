import { useEffect } from 'react';

/**
 * Enfoca el input referenciado al presionar "/", siempre que el foco
 * no esté ya en un campo de texto (input, textarea, select o contentEditable).
 * Convención habitual en paneles admin (GitHub, Linear, Notion, etc.).
 *
 * @param {React.RefObject<HTMLInputElement>} inputRef
 */
const useSlashFocus = (inputRef) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== '/') return;

      const tag = document.activeElement?.tagName;
      const isEditable =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
        document.activeElement?.isContentEditable;

      if (isEditable) return;

      e.preventDefault();
      inputRef.current?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [inputRef]);
};

export default useSlashFocus;
