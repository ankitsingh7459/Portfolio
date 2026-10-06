import { printApmProject } from './printapm';

export const DEFAULT_PROJECTS = [
  printApmProject,
  {
    _id: '1',
    slug: 'portfolio',
    title: 'Portfolio',
    description:
      'Personal portfolio website and API for showcasing projects, certifications, GitHub activity, and contact workflows.',
    techStack: ['React', 'Vite', 'Node.js', 'Express', 'MySQL'],
    githubUrl: 'https://github.com/ankitsingh7459/Portfolio',
    liveUrl: null,
    featured: true,
  },
  {
    _id: '2',
    slug: 'cosupport',
    title: 'CoSupport',
    description:
      'Collaborative AI support project with backend development and RAG-powered knowledge retrieval.',
    techStack: ['Backend', 'RAG', 'API', 'AI'],
    githubUrl: 'https://github.com/Saadkhan10412/Cosupport',
    liveUrl: null,
    featured: true,
  },
  {
    _id: '3',
    slug: 'bank-management-system',
    title: 'Bank Management System',
    description:
      'Secure full-stack banking application with account management, transactions, and role-based access control.',
    techStack: ['Java', 'MySQL', 'Spring Boot', 'React'],
    githubUrl: 'https://github.com/ankitsingh7459/Bank-Management-System',
    liveUrl: null,
    featured: true,
  },
  {
    _id: '4',
    slug: 'java-ludo-snake-ladder',
    title: 'Java Ludo and Snake Ladder',
    description:
      'Java game project combining Ludo and Snake Ladder gameplay fundamentals.',
    techStack: ['Java'],
    githubUrl: 'https://github.com/ankitsingh7459/Java-Project-LUDO-AND-SNAKE-LADDER-',
    liveUrl: null,
    featured: false,
  },
];

export default DEFAULT_PROJECTS;
