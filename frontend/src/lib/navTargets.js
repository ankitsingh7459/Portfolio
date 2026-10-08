export const NAV_TARGETS = [
  {
    id: 'projects',
    label: 'Projects',
    type: 'section',
    target: '#projects',
    description: 'Featured projects and systems',
  },
  {
    id: 'printapm',
    label: 'PrintAPM Case Study',
    type: 'route',
    target: '/projects/printapm',
    description: 'Deep dive into PrintAPM offline kiosk system',
  },
  {
    id: 'about',
    label: 'About',
    type: 'section',
    target: '#about',
    description: 'Background, focus areas, and principles',
  },
  {
    id: 'stack',
    label: 'Stack',
    type: 'section',
    target: '#stack',
    description: 'Technologies and tools',
  },
  {
    id: 'log',
    label: 'Log',
    type: 'section',
    target: '#log',
    description: 'Engineering journey and milestones',
  },
  {
    id: 'github',
    label: 'GitHub Activity',
    type: 'section',
    target: '#github',
    description: 'Recent public repository activity',
  },
  {
    id: 'resume',
    label: 'Resume',
    type: 'section',
    target: '#resume',
    description: 'View or download resume',
  },
  {
    id: 'contact',
    label: 'Contact',
    type: 'section',
    target: '#contact',
    description: 'Get in touch / send a message',
  },
];

export const VALID_OPEN_TARGETS = [
  'printapm',
  'projects',
  'about',
  'stack',
  'log',
  'github',
  'resume',
  'contact',
];

export const getNavTarget = (targetId) => {
  if (!targetId || typeof targetId !== 'string') return null;
  const normalized = targetId.trim().toLowerCase();
  return NAV_TARGETS.find((item) => item.id.toLowerCase() === normalized) || null;
};
