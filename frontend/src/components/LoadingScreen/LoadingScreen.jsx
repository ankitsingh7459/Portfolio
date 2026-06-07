import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 400);
          return 100;
        }
        return p + Math.random() * 12 + 4;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative mb-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="h-20 w-20 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#00d4ff',
            borderRightColor: '#a855f7',
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border border-[#00d4ff33]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.h2
        className="neon-text text-2xl font-bold tracking-widest md:text-3xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        ANKIT SINGH
      </motion.h2>
      <motion.p
        className="mt-2 font-mono text-sm text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Initializing portfolio...
      </motion.p>

      <motion.div
        className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
          style={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
      <span className="mt-2 font-mono text-xs text-[#00d4ff]">
        {Math.min(Math.round(progress), 100)}%
      </span>
    </motion.div>
  );
};

export default LoadingScreen;
