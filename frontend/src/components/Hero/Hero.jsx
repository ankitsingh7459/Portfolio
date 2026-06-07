import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Mail, FolderOpen } from 'lucide-react';
import profilePhoto from '../../assets/profile-photo.png';

const ROLES = ['AI/ML Engineer', 'Vibe Coder', 'Tech Enthusiast'];

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (displayText.length < current.length) {
            setDisplayText(current.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setDeleting(true), 1800);
          }
        } else if (displayText.length > 0) {
          setDisplayText(current.slice(0, displayText.length - 1));
        } else {
          setDeleting(false);
          setRoleIndex((i) => (i + 1) % ROLES.length);
        }
      },
      deleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [displayText, deleting, roleIndex]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      <div className="section-padding grid w-full items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="mb-4 font-mono text-sm text-[#00d4ff]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {'// Hello, World!'}
          </motion.p>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Hi, I&apos;m{' '}
            <span className="neon-text">Ankit Singh</span>
          </h1>
          <motion.div className="mt-4 h-10 text-xl text-zinc-400 md:text-2xl">
            <span className="text-[#a855f7]">{displayText}</span>
            <motion.span
              className="inline-block w-0.5 h-6 bg-[#00d4ff] ml-1 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </motion.div>
          <p className="mt-6 max-w-lg text-zinc-400 leading-relaxed">
            Second-year CSE student crafting intelligent solutions at the
            intersection of AI, cloud, and full-stack development.
          </p>

          <motion.div className="mt-8 flex flex-wrap gap-4">
            <motion.button
              type="button"
              onClick={() => scrollTo('projects')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#a855f7] px-6 py-3 text-sm font-semibold text-black neon-glow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FolderOpen size={18} />
              View Projects
            </motion.button>
            <motion.a
              href="/resume.pdf"
              download
              className="glass flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white hover:border-[#00d4ff44]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={18} />
              Download Resume
            </motion.a>
            <motion.button
              type="button"
              onClick={() => scrollTo('contact')}
              className="glass flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail size={18} />
              Contact Me
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#00d4ff33] to-[#a855f733] blur-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="glass relative flex h-64 w-64 items-center justify-center rounded-full md:h-80 md:w-80 neon-glow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-[90%] w-[90%] overflow-hidden rounded-full border border-white/10 bg-[#12121a]">
                <img
                  src={profilePhoto}
                  alt="Ankit Singh"
                  className="h-full w-full object-cover object-[50%_32%]"
                />
              </div>
            </motion.div>
            <motion.div
              className="absolute -right-2 top-8 glass rounded-xl px-3 py-2 text-xs font-mono text-[#00d4ff]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              AI/ML
            </motion.div>
            <motion.div
              className="absolute -left-4 bottom-12 glass rounded-xl px-3 py-2 text-xs font-mono text-[#a855f7]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            >
              Cloud
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollTo('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </motion.button>
    </section>
  );
};

export default Hero;
