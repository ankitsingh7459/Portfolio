import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const Skills = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="skills" className="section-padding" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <p className="font-mono text-sm text-[#00d4ff]">{'// Tech Stack'}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          Skills & <span className="neon-text">Technologies</span>
        </h2>
      </motion.div>
      <div className="border border-[#2E2A21] bg-[#1E1B15] p-6 text-center text-sm font-mono text-[#B9B09A]">
        $ cat stack.json (stack listing will be formatted in Slice 3)
      </div>
    </section>
  );
};

export default Skills;
