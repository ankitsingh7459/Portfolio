import { contactData } from '../../data/contact';

const isRealUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (
    trimmed === '' ||
    trimmed === '#' ||
    trimmed.startsWith('[') ||
    trimmed.toLowerCase().includes('fill') ||
    trimmed === 'null' ||
    trimmed === 'undefined'
  ) {
    return false;
  }
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/')
  );
};

const Footer = () => {
  const year = new Date().getFullYear();

  const links = [
    { label: 'github', href: contactData.githubUrl, external: true },
    { label: 'linkedin', href: contactData.linkedinUrl, external: true },
    contactData.email && isRealUrl(contactData.email)
      ? {
          label: 'email',
          href: contactData.email.startsWith('mailto:')
            ? contactData.email
            : `mailto:${contactData.email}`,
          external: false,
        }
      : null,
    { label: 'resume.pdf', href: contactData.resumeUrl, external: true },
  ].filter(Boolean);

  return (
    <footer aria-label="Site Footer" className="border-t border-[#2E2A21] bg-[#16140F] py-12 mt-16 text-sm font-mono">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-[#B9B09A]">
          <span className="text-[#E8A33D]" aria-hidden="true">$</span>
          <span>echo &quot;Ankit Singh (c) {year}&quot;</span>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {links.map((link) => {
            const isReal = isRealUrl(link.href);
            if (!isReal) return null;
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-[#B9B09A] hover:text-[#E8A33D] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px]"
                >
                  <span>[{link.label}]</span>
                  {link.external && (
                    <span className="sr-only"> (opens in new tab)</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
