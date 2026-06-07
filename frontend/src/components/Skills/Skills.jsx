import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SkillGalaxy from '../SkillGalaxy/SkillGalaxy';

const Skills = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="skills" className="section-padding" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="font-mono text-sm text-[#00d4ff]">{'// Tech Stack'}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          Skill <span className="neon-text">Galaxy</span>
        </h2>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          Hover over each planet to explore proficiency levels
        </p>
      </motion.div>
      <SkillGalaxy />
    </section>
  );
};

export default Skills;
