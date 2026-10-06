import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Hook to trigger a one-time visibility reveal using IntersectionObserver.
 * Respects reduced-motion preference by immediately returning true.
 * @param {IntersectionObserverInit} [options]
 * @returns {[React.RefObject, boolean]} Ref to attach and isRevealed boolean.
 */
export const useReveal = (options = { threshold: 0.15 }) => {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        setIsRevealed(true);
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [options, prefersReduced]);

  return [ref, prefersReduced || isRevealed];
};

export default useReveal;
