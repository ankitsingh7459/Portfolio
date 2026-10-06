const LINKS = [
  { href: 'https://github.com/ankitsingh7459', label: 'github' },
  { href: 'https://www.linkedin.com/in/ankit-singh-tech', label: 'linkedin' },
  { href: 'mailto:ankitenterprises0001@gmail.com', label: 'email' },
  { href: '/resume.pdf', label: 'resume.pdf' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2E2A21] bg-[#16140F] py-12 mt-16 text-sm font-mono">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-[#B9B09A]">
          <span className="text-[#E8A33D]">$</span>
          <span>echo &quot;Ankit Singh (c) {year}&quot;</span>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.label === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-[#B9B09A] hover:text-[#E8A33D] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
              >
                [{link.label}]
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
