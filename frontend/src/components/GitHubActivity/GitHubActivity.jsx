import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Star, GitFork, ExternalLink } from 'lucide-react';
import { getGitHubActivity } from '../../services/api';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const DEFAULT_DATA = {
  username: 'ankitsingh7459',
  stats: { repos: 4, stars: 0, forks: 0 },
  repos: [
    {
      name: 'Portfolio',
      description: 'Know Ankit Singh',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      url: 'https://github.com/ankitsingh7459/Portfolio',
    },
    {
      name: 'Bank-Management-System',
      description: 'Secure banking application',
      stars: 0,
      forks: 0,
      language: 'Java',
      url: 'https://github.com/ankitsingh7459/Bank-Management-System',
    },
    {
      name: 'Java-Project-LUDO-AND-SNAKE-LADDER-',
      description: 'Java game project',
      stars: 0,
      forks: 0,
      language: 'Java',
      url: 'https://github.com/ankitsingh7459/Java-Project-LUDO-AND-SNAKE-LADDER-',
    },
  ],
};

const GitHubActivity = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    getGitHubActivity()
      .then((res) => {
        const payload = res.data?.data || res.data;
        if (payload) setData(payload);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-sm text-[#00d4ff]">{'// Open Source'}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          GitHub <span className="neon-text">Activity</span>
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 grid gap-4 sm:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
      >
        {[
          { label: 'Repositories', value: data.stats?.repos },
          { label: 'Stars', value: data.stats?.stars },
          { label: 'Forks', value: data.stats?.forks },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="glass rounded-xl p-4 text-center"
            whileHover={{ y: -2 }}
          >
            <p className="text-2xl font-bold neon-text">{stat.value ?? '-'}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 space-y-4"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
        {(data.repos || []).map((repo, i) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex flex-col gap-3 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between hover:border-[#00d4ff33] transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 * i }}
            whileHover={{ x: 4 }}
          >
            <motion.div className="flex items-start gap-3">
              <Code2 className="mt-1 shrink-0 text-zinc-400" size={20} />
              <motion.div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  {repo.name}
                  <ExternalLink size={14} className="text-zinc-500" />
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{repo.description}</p>
                {repo.language && (
                  <span className="mt-2 inline-block rounded-full bg-[#00d4ff22] px-2 py-0.5 text-xs text-[#00d4ff]">
                    {repo.language}
                  </span>
                )}
              </motion.div>
            </motion.div>
            <motion.div className="flex gap-4 text-sm text-zinc-500 sm:shrink-0">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-[#f59e0b]" />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={14} />
                {repo.forks}
              </span>
            </motion.div>
          </motion.a>
        ))}
      </motion.div>

      <motion.a
        href={`https://github.com/${data.username || 'ankitsingh7459'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm text-[#00d4ff] hover:underline"
        whileHover={{ x: 4 }}
      >
        View all on GitHub {'->'}
      </motion.a>
    </section>
  );
};

export default GitHubActivity;
