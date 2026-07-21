import { useEffect, useState, useCallback } from 'react';

const useScrollReveal = ({ threshold = 0.15, rootMargin = '0px 0px -80px 0px' } = {}) => {
  // Callback ref en vez de useRef: mutar `ref.current` no es reactivo y el
  // useEffect nunca se enteraría de que React montó un NODO NUEVO cuando la
  // sección se desmonta/remonta condicionalmente (p. ej. el CTA de !isAuthenticated
  // tras un ciclo login → logout). Guardar el nodo en estado sí dispara el efecto.
  const [node, setNode] = useState(null);
  const ref = useCallback((el) => setNode(el), []);

  // Si el navegador no soporta IntersectionObserver, arranca visible directo
  // (se resuelve acá, no en el efecto, para no disparar un setState síncrono).
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    if (isVisible || !node) return; // ya visible, o el nodo todavía no montó

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node); // se anima una sola vez
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin, isVisible]);

  return [ref, isVisible];
};

export default useScrollReveal;