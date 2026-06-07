import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkills } from '../../services/api';

const DEFAULT_SKILLS = [
  { name: 'Python', proficiency: 88, category: 'Languages' },
  { name: 'Java', proficiency: 82, category: 'Languages' },
  { name: 'React', proficiency: 85, category: 'Web' },
  { name: 'AWS', proficiency: 75, category: 'Cloud' },
  { name: 'MySQL', proficiency: 80, category: 'Database' },
  { name: 'Git', proficiency: 90, category: 'Tools' },
  { name: 'ML/AI', proficiency: 78, category: 'AI' },
  { name: 'Docker', proficiency: 70, category: 'DevOps' },
];

const CATEGORY_COLORS = {
  Languages: '#00d4ff',
  Web: '#a855f7',
  Cloud: '#f59e0b',
  Database: '#10b981',
  Tools: '#ec4899',
  AI: '#6366f1',
  DevOps: '#14b8a6',
};

const SkillGalaxy = () => {
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then((res) => {
        const data = res.data?.skills || res.data;
        if (Array.isArray(data) && data.length) setSkills(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const radius = 180;
  const center = 220;

  return (
    <motion.div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: 440, height: 440, maxWidth: '100%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {skills.map((skill, i) => {
          const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
          const x = center + Math.cos(angle) * radius - 40;
          const y = center + Math.sin(angle) * radius - 40;
          const color =
            CATEGORY_COLORS[skill.category] || '#00d4ff';
          const isHovered = hovered?.name === skill.name;

          return (
            <motion.div
              key={skill.name}
              className="absolute cursor-pointer"
              style={{ left: x, top: y, width: 80, height: 80 }}
              onMouseEnter={() => setHovered(skill)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ scale: 1.15, zIndex: 10 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="flex h-full w-full flex-col items-center justify-center rounded-full glass text-center"
                style={{
                  boxShadow: isHovered
                    ? `0 0 30px ${color}66, 0 0 60px ${color}33`
                    : 'none',
                  borderColor: isHovered ? color : undefined,
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: isHovered ? color : '#e4e4e7' }}
                >
                  {skill.name}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full glass neon-glow">
        <div className="text-center">
          <span className="neon-text text-2xl font-bold">AS</span>
          <p className="text-[10px] text-zinc-500 mt-1">
            {loading ? '...' : `${skills.length} skills`}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 glass rounded-xl px-6 py-4 text-center min-w-[200px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="font-semibold text-white">{hovered.name}</p>
            <p className="text-xs text-zinc-500">{hovered.category}</p>
            <motion.div
              className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
                initial={{ width: 0 }}
                animate={{ width: `${hovered.proficiency}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            <p className="mt-1 text-sm text-[#00d4ff]">
              {hovered.proficiency}% proficiency
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SkillGalaxy;
