import { motion } from 'framer-motion';
import { Code2, Link2, Mail, FileText, Heart } from 'lucide-react';

const LINKS = [
  { icon: Code2, href: 'https://github.com/ankitsingh7459', label: 'GitHub' },
  { icon: Link2, href: 'https://www.linkedin.com/in/ankit-singh-tech', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:ankitenterprises0001@gmail.com', label: 'Email' },
  { icon: FileText, href: '/resume.pdf', label: 'Resume' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-12">
      <motion.div
        className="section-padding !py-0 flex flex-col items-center gap-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div className="flex gap-4">
          {LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.label === 'Email' ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="glass flex h-12 w-12 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:text-[#00d4ff] hover:border-[#00d4ff33]"
              whileHover={{ y: -3, scale: 1.05 }}
              aria-label={link.label}
            >
              <link.icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        <motion.p className="flex items-center gap-1 text-sm text-zinc-500">
          Built with <Heart size={14} className="text-[#a855f7]" /> by{' '}
          <span className="neon-text font-medium">Ankit Singh</span>
        </motion.p>
        <p className="font-mono text-xs text-zinc-600">
          (c) {year} Ankit Singh. All rights reserved.
        </p>
        <p className="text-xs text-zinc-600">
          Press <kbd className="rounded bg-white/5 px-1.5 py-0.5 font-mono">Ctrl+`</kbd> for
          terminal | <kbd className="rounded bg-white/5 px-1.5 py-0.5 font-mono">/</kbd> for chat
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
