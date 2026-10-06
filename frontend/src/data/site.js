export const SITE_URL =
  import.meta.env.VITE_SITE_URL && import.meta.env.VITE_SITE_URL.trim() !== ''
    ? import.meta.env.VITE_SITE_URL.trim().replace(/\/$/, '')
    : '[FILL: domain]';

export const siteConfig = {
  siteUrl: SITE_URL,
  name: 'Ankit Singh',
  title: 'Ankit Singh | [FILL: title]',
  description: 'Personal portfolio of Ankit Singh, [FILL: title].',
  ogTitle: 'Ankit Singh | [FILL: title]',
  ogDescription: 'Personal engineering portfolio and systems proof of work.',
  themeColor: '#16140F',
  colorScheme: 'dark',
  githubUrl: 'https://github.com/ankitsingh7459',
};

export default siteConfig;
