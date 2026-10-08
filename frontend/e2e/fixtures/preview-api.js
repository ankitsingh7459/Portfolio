// Synthetic fixtures; not evidence of live backend data or repository metrics.
export const projects = [
  { id: 1, title: 'Portfolio', description: 'Local verification fixture for portfolio projects.', tech_stack: ['React', 'Vite'], github_url: 'https://github.com/ankitsingh7459/Portfolio', featured: true },
  { id: 2, title: 'CoSupport', description: 'Local verification fixture for collaborative support.', tech_stack: ['API', 'AI'], github_url: 'https://github.com/Saadkhan10412/Cosupport', featured: true },
];
export const github = {
  username: 'ankitsingh7459', stats: { repos: 2, stars: 0, forks: 0 },
  repos: projects.map(p => ({ name: p.title, description: p.description,
    url: p.github_url, language: 'JavaScript', stars: 0, forks: 0 })),
};
