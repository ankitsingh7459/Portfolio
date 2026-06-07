import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import { getProjects } from '../../services/api';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const DEFAULT_PROJECTS = [
  {
    _id: '1',
    title: 'Portfolio',
    description:
      'Personal portfolio website and API for showcasing projects, certifications, GitHub activity, and contact workflows.',
    techStack: ['React', 'Vite', 'Node.js', 'Express', 'MySQL'],
    githubUrl: 'https://github.com/ankitsingh7459/Portfolio',
    liveUrl: '#',
    featured: true,
  },
  {
    _id: '2',
    title: 'CoSupport',
    description:
      'Collaborative AI support project where I handled backend development and helped implement RAG-powered knowledge retrieval.',
    techStack: ['Backend', 'RAG', 'API', 'AI'],
    githubUrl: 'https://github.com/Saadkhan10412/Cosupport',
    liveUrl: null,
    featured: true,
  },
  {
    _id: '3',
    title: 'Bank Management System',
    description:
      'Secure full-stack banking application with account management, transactions, and role-based access control.',
    techStack: ['Java', 'MySQL', 'Spring Boot', 'React'],
    githubUrl: 'https://github.com/ankitsingh7459/Bank-Management-System',
    liveUrl: '#',
    featured: true,
  },
  {
    _id: '4',
    title: 'Java Ludo and Snake Ladder',
    description:
      'Java game project combining Ludo and Snake Ladder gameplay fundamentals.',
    techStack: ['Java'],
    githubUrl: 'https://github.com/ankitsingh7459/Java-Project-LUDO-AND-SNAKE-LADDER-',
    liveUrl: null,
    featured: false,
  },
];

const normalizeProject = (project) => ({
  ...project,
  _id: project._id ?? project.id,
  techStack: project.techStack ?? project.tech_stack ?? [],
  githubUrl: project.githubUrl ?? project.github_url,
  liveUrl: project.liveUrl ?? project.live_url,
});

const Projects = () => {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    getProjects()
      .then((res) => {
        const data = res.data?.data || res.data?.projects || res.data;
        if (Array.isArray(data) && data.length) setProjects(data.map(normalizeProject));
      })
      .catch(() => {});
  }, []);

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-sm text-[#00d4ff]">{'// Portfolio'}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          Featured <span className="neon-text">Projects</span>
        </h2>
      </motion.div>

      <motion.div
        className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
      >
        {projects.map((project, i) => (
          <motion.article
            key={project._id || project.title}
            className="glass group relative flex flex-col overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 * i }}
            whileHover={{ y: -6 }}
          >
            <motion.div
              className="h-2 bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="flex flex-1 flex-col p-6"
              initial={false}
              whileHover={{ paddingBottom: '2rem' }}
            >
              {project.featured && (
                <span className="mb-3 w-fit rounded-full bg-[#00d4ff22] px-3 py-1 text-xs text-[#00d4ff]">
                  Featured
                </span>
              )}
              <h3 className="text-xl font-semibold text-white group-hover:neon-text transition-all">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 line-clamp-3 group-hover:line-clamp-none transition-all">
                {project.description}
              </p>
              <motion.div
                className="mt-4 flex flex-wrap gap-2"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                {(project.techStack || []).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-white/5 px-2 py-1 text-xs text-zinc-400"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
              <motion.div
                className="mt-4 flex gap-3 opacity-80 group-hover:opacity-100"
                initial={{ y: 0 }}
                whileHover={{ y: -2 }}
              >
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-zinc-400 hover:text-[#00d4ff]"
                  >
                    <Code2 size={16} />
                    Code
                  </a>
                )}
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-zinc-400 hover:text-[#a855f7]"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </motion.div>
            </motion.div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
