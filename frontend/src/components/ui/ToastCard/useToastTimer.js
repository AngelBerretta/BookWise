import { useEffect, useRef } from 'react';

/** Cierra el toast automáticamente pasado `duration` ms. */
const useToastTimer = (onClose, duration) => {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timerRef.current);
  }, [onClose, duration]);
};

export default useToastTimer;