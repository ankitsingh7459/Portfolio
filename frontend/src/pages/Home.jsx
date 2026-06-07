import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { trackVisit } from '../services/api';

import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Timeline from '../components/Timeline/Timeline';
import Certifications from '../components/Certifications/Certifications';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
import ScrollProgress from '../components/ScrollProgress/ScrollProgress';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import HiddenEasterEgg from '../components/HiddenEasterEgg/HiddenEasterEgg';
import AIAssistant from '../components/AIAssistant/AIAssistant';
import TerminalMode from '../components/TerminalMode/TerminalMode';

const ParticleBackground = lazy(
  () => import('../components/ParticleBackground/ParticleBackground')
);
const AnimatedCursor = lazy(
  () => import('../components/AnimatedCursor/AnimatedCursor')
);
const VisitorStats = lazy(
  () => import('../components/VisitorStats/VisitorStats')
);
const GitHubActivity = lazy(
  () => import('../components/GitHubActivity/GitHubActivity')
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { setAccessGranted, toggleTheme } = useTheme();

  const triggerEasterEgg = useCallback(() => {
    setAccessGranted(true);
  }, [setAccessGranted]);

  useEasterEgg(triggerEasterEgg);

  useKeyboardShortcuts({
    onTerminal: () => setTerminalOpen(true),
    onChat: () => setChatOpen((o) => !o),
    onTheme: toggleTheme,
  });

  useEffect(() => {
    if (!loading) {
      const sid = sessionStorage.getItem('session_id') || crypto.randomUUID();
      sessionStorage.setItem('session_id', sid);
      trackVisit({ session_id: sid, page_path: '/', section: 'home' }).catch(() => {});
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <AnimatePresence>
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Suspense fallback={null}>
              <ParticleBackground />
              <AnimatedCursor />
            </Suspense>

            <ScrollProgress />
            <Navbar />
            <ThemeToggle />
            <HiddenEasterEgg />

            <div className="relative z-10">
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Suspense fallback={null}>
                <GitHubActivity />
              </Suspense>
              <Timeline />
              <Certifications />
              <Contact />
              <Suspense fallback={null}>
                <VisitorStats />
              </Suspense>
              <Footer />
            </div>

            <AIAssistant open={chatOpen} onToggle={() => setChatOpen((o) => !o)} />
            <TerminalMode open={terminalOpen} onClose={() => setTerminalOpen(false)} />
          </motion.main>
        </AnimatePresence>
      )}
    </>
  );
};

export default Home;
