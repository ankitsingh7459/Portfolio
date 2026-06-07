import { motion } from 'framer-motion';
import { Brain, Cloud, Rocket } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const CARDS = [
  {
    icon: Brain,
    title: 'AI Journey',
    text: 'From curiosity to creation — exploring machine learning, neural networks, and building intelligent applications like Support Pilot.',
    color: '#00d4ff',
  },
  {
    icon: Cloud,
    title: 'Cloud Explorer',
    text: 'Passionate about AWS services — EC2, S3, Lambda — architecting scalable, cloud-native solutions for real-world problems.',
    color: '#a855f7',
  },
  {
    icon: Rocket,
    title: 'Future Goals',
    text: 'Aspiring to become a full-stack AI engineer, contributing to open-source, and building products that make technology accessible.',
    color: '#00d4ff',
  },
];

const About = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="about" className="section-padding" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p className="font-mono text-sm text-[#00d4ff]">{'// About Me'}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          Crafting the <span className="neon-text">Future</span> with Code
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-400">
          I&apos;m <strong className="text-white">Ankit Singh</strong>, a second-year
          Computer Science Engineering student with a deep passion for artificial
          intelligence and cloud computing. I blend creativity with engineering
          discipline to build solutions that are both elegant and impactful.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            className="glass group rounded-2xl p-6 transition-colors hover:border-[#00d4ff33]"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
            whileHover={{ y: -4 }}
          >
            <card.icon
              size={32}
              style={{ color: card.color }}
              className="mb-4"
            />
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About;
