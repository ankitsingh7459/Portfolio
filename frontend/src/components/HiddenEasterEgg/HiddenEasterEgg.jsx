import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const HiddenEasterEgg = () => {
  const { accessGranted, setAccessGranted } = useTheme();

  return (
    <AnimatePresence>
      {accessGranted && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAccessGranted(false)}
        >
          <motion.div
            className="relative max-w-lg p-8 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl border border-[#00d4ff]"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0,212,255,0.3)',
                  '0 0 60px rgba(0,212,255,0.6)',
                  '0 0 20px rgba(0,212,255,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <Shield className="mx-auto mb-4 text-[#00d4ff]" size={64} />
            </motion.div>

            <motion.h2
              className="font-mono text-3xl font-bold tracking-[0.3em] text-[#00d4ff] md:text-4xl"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1 }}
            >
              ACCESS GRANTED
            </motion.h2>

            <motion.p
              className="mt-4 font-mono text-sm text-[#a855f7]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Lock size={14} className="inline mr-1" />
              Konami code activated - welcome to the inner circle.
            </motion.p>

            <motion.div
              className="mt-6 space-y-1 font-mono text-xs text-zinc-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>{'>'} decrypting portfolio.dat...</p>
              <p>{'>'} bypassing firewall...</p>
              <p className="text-[#00d4ff]">{'>'} status: ELITE_DEVELOPER</p>
            </motion.div>

            <motion.button
              type="button"
              onClick={() => setAccessGranted(false)}
              className="mt-8 rounded-lg border border-[#00d4ff44] px-6 py-2 font-mono text-sm text-[#00d4ff] hover:bg-[#00d4ff11]"
              whileHover={{ scale: 1.05 }}
            >
              [ DISMISS ]
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HiddenEasterEgg;
