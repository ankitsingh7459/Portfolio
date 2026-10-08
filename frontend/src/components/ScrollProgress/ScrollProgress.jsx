import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ScrollProgress = () => {
  const barRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    let ticking = false;

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const clamped = Math.min(Math.max(progress, 0), 1);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${clamped})`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[#E8A33D] transform-gpu will-change-transform"
      style={{ transform: 'scaleX(0)' }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
