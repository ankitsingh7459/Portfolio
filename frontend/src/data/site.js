export const SITE_URL =
  import.meta.env.VITE_SITE_URL && import.meta.env.VITE_SITE_URL.trim() !== ''
    ? import.meta.env.VITE_SITE_URL.trim().replace(/\/$/, '')
    : '';

export const siteConfig = {
  siteUrl: SITE_URL,
  name: 'Ankit Singh',
  title: 'Ankit Singh | Full-Stack Developer',
  description: 'Personal portfolio of Ankit Singh, Full-Stack Developer and Co-Founder & Technical Lead at PrintAPM.',
  ogTitle: 'Ankit Singh | Full-Stack Developer',
  ogDescription: 'Personal engineering portfolio and systems proof of work.',
  themeColor: '#16140F',
  colorScheme: 'dark',
  githubUrl: 'https://github.com/ankitsingh7459',
  linkedinUrl: 'https://www.linkedin.com/in/ankit-singh-tech',
};

export default siteConfig;
