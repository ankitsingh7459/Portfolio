import { m } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useReveal } from '../hooks/useReveal';

/**
 * Reveal: vertical slice fade-in animation matching DESIGN.md spec:
 * y: 12 -> 0, opacity: 0 -> 1, 0.45s ease-out, once.
 * Instantly visible under prefers-reduced-motion.
 */
export const Reveal = ({
  children,
  className = '',
  delay = 0,
  y = 12,
  duration = 0.45,
}) => {
  const [ref, isRevealed] = useReveal();
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </m.div>
  );
};

export default Reveal;
