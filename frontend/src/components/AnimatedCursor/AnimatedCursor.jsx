import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window;
    if (isTouch) return;

    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00d4ff66]"
        style={{ left: pos.x, top: pos.y }}
        animate={{ left: pos.x, top: pos.y }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9997] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          left: pos.x,
          top: pos.y,
          background:
            'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(168,85,247,0.08) 40%, transparent 70%)',
        }}
        animate={{ left: pos.x, top: pos.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.8 }}
      />
    </>
  );
};

export default AnimatedCursor;
