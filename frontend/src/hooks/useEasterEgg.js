import { useEffect, useRef } from 'react';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];

export const useEasterEgg = (onTrigger) => {
  const indexRef = useRef(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === KONAMI[indexRef.current]) {
        indexRef.current += 1;
        if (indexRef.current === KONAMI.length) {
          indexRef.current = 0;
          onTrigger?.();
        }
      } else {
        indexRef.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onTrigger]);
};
