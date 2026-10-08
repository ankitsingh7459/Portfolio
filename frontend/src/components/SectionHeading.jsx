import { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import TypedText from './TypedText';

/**
 * SectionHeading: Shell command prompt style heading (e.g. "$ ls projects").
 * Types once when ~40% visible per DESIGN.md.
 */
export const SectionHeading = ({
  command = 'ls projects',
  prompt = '$',
  className = '',
  description = '',
}) => {
  const headingRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [isInView, setIsInView] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced || isInView) return;

    const node = headingRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [prefersReduced, isInView]);

  return (
    <div ref={headingRef} className={`mb-8 ${className}`}>
      <h2 className="font-mono text-xl md:text-2xl font-semibold text-[#F1E9D2]">
        <span className="sr-only">{command}</span>
        <span aria-hidden="true" className="flex items-center gap-2">
          <span className="text-[#E8A33D] select-none">
            {prompt}
          </span>
          <TypedText
            text={command}
            speed={32}
            isTriggered={isInView}
            showCursor={!isInView}
            className="text-[#F1E9D2]"
          />
        </span>
      </h2>
      {description && (
        <p className="mt-2 font-sans text-sm text-[#B9B09A] max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
