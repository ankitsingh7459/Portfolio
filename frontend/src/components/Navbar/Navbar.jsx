import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const LINKS = [
  { label: 'projects', id: 'projects' },
  { label: 'about', id: 'about' },
  { label: 'stack', id: 'stack' },
  { label: 'log', id: 'log' },
  { label: 'github', id: 'github' },
  { label: 'contact', id: 'contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');
  const [hovered, setHovered] = useState(null);
  const prefersReduced = useReducedMotion();
  const navRef = useRef(null);

  // Scroll border & background handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0,
      }
    );

    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const heroEl = document.getElementById('hero');
    if (heroEl) observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  // Keyboard accessibility: Escape closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#16140F]/95 backdrop-none border-b border-[#2E2A21] py-3'
          : 'bg-transparent border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Terminal Logo */}
        <button
          type="button"
          onClick={() => scrollTo('hero')}
          className="group flex items-center gap-1 font-mono text-sm md:text-base font-semibold text-[#F1E9D2] hover:text-[#E8A33D] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2"
          aria-label="Scroll to top"
        >
          <span className="text-[#E8A33D] group-hover:underline">~/</span>
          <span>ankit</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {LINKS.map((link) => {
            const isActive = active === link.id;
            const isHovered = hovered === link.id;
            const showLine = isHovered || (isActive && hovered === null);

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                onMouseEnter={() => setHovered(link.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative px-3 py-1.5 font-mono text-sm transition-colors rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 ${
                  isActive ? 'text-[#E8A33D]' : 'text-[#B9B09A] hover:text-[#F1E9D2]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-[#E8A33D]/60 mr-1 select-none">.</span>
                {link.label}
                {showLine && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#E8A33D] transition-all duration-200"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#B9B09A] hover:text-[#F1E9D2] border border-[#2E2A21] bg-[#1E1B15] rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div
          className="md:hidden bg-[#1E1B15] border-b border-[#2E2A21] px-4 py-3 mx-2 mt-2 rounded-[2px]"
          role="dialog"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className={`text-left px-3 py-2 font-mono text-sm border-l-2 rounded-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D] ${
                    isActive
                      ? 'border-[#E8A33D] text-[#E8A33D] bg-[#16140F]'
                      : 'border-transparent text-[#B9B09A] hover:text-[#F1E9D2] hover:bg-[#16140F]'
                  }`}
                >
                  $ cd ~/{link.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
