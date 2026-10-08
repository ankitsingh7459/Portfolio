import { useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * TypedText: typing effect component that types once, supports skipping on click/key,
 * and renders instantly without animation under prefers-reduced-motion.
 */
export const TypedText = ({
  text = '',
  speed = 28,
  delay = 0,
  onComplete,
  showCursor = true,
  isTriggered = true,
  skippable = true,
  className = '',
  cursorClassName = 'text-[#E8A33D]',
}) => {
  const prefersReduced = useReducedMotion();
  const [displayedText, setDisplayedText] = useState(prefersReduced ? text : '');
  const [isDone, setIsDone] = useState(prefersReduced);

  const completeImmediately = useCallback(() => {
    setDisplayedText(text);
    setIsDone(true);
    if (onComplete) onComplete();
  }, [text, onComplete]);

  // Handle typing effect
  useEffect(() => {
    if (prefersReduced || !isTriggered || isDone) return;

    let index = 0;
    let timerId = null;

    const startTimeout = setTimeout(() => {
      timerId = setInterval(() => {
        index += 1;
        setDisplayedText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(timerId);
          setIsDone(true);
          if (onComplete) onComplete();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timerId) clearInterval(timerId);
    };
  }, [text, speed, delay, isTriggered, isDone, prefersReduced, onComplete]);

  // Skip on click or keypress
  useEffect(() => {
    if (!skippable || isDone || prefersReduced) return;

    const handleSkip = () => completeImmediately();
    window.addEventListener('keydown', handleSkip, { once: true });
    return () => window.removeEventListener('keydown', handleSkip);
  }, [skippable, isDone, prefersReduced, completeImmediately]);

  const outputText = prefersReduced ? text : displayedText;
  const isFinished = prefersReduced || isDone;

  return (
    <span
      className={`font-mono ${className}`}
      onClick={skippable && !isFinished ? completeImmediately : undefined}
    >
      {outputText}
      {showCursor && !isFinished && (
        <span
          className={`inline-block ml-0.5 animate-pulse font-mono ${cursorClassName}`}
          aria-hidden="true"
        >
          ▍
        </span>
      )}
    </span>
  );
};

export default TypedText;
