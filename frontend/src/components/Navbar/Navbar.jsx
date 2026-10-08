import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { resumeData } from '../../data/resume';
import { timelineEntries } from '../../data/timeline';
import { certifications } from '../../data/certifications';
import { NAV_TARGETS } from '../../lib/navTargets';

const LINKS = NAV_TARGETS
  .filter((target) => target.type === 'section')
  .filter((target) => target.id !== 'resume' || resumeData?.available)
  .filter((target) => target.id !== 'log' || (timelineEntries?.length > 0 || certifications?.length > 0))
  .map((target) => ({ label: target.id, id: target.id }));

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [active, setActive] = useState('');
  const [hovered, setHovered] = useState(null);
  const prefersReduced = useReducedMotion();
  const navRef = useRef(null);

  // Sync command palette open state
  useEffect(() => {
    const handlePaletteChange = (e) => {
      setPaletteOpen(Boolean(e.detail?.isOpen));
    };
    window.addEventListener('command-palette-change', handlePaletteChange);
    return () => window.removeEventListener('command-palette-change', handlePaletteChange);
  }, []);

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
        navRef.current?.querySelector('button[aria-label$="navigation menu"]')?.focus();
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
          aria-label="~/ankit, scroll to top"
        >
          <span className="text-[#E8A33D] group-hover:underline">~/</span>
          <span>ankit</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <nav className="flex items-center gap-1" aria-label="Primary">
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
                  aria-current={isActive ? 'location' : undefined}
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

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="font-mono text-xs text-[#B9B09A] hover:text-[#F1E9D2] hover:border-[#E8A33D] border border-[#2E2A21] bg-[#1E1B15] px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 flex items-center gap-1.5 min-h-[32px]"
            aria-label="Ctrl K: Open command palette"
            aria-haspopup="dialog"
            aria-expanded={paletteOpen}
          >
            <span className="text-[#E8A33D] select-none" aria-hidden="true">&gt;</span>
            <span>Ctrl K</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-[#B9B09A] hover:text-[#F1E9D2] border border-[#2E2A21] bg-[#1E1B15] rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div
          className="md:hidden bg-[#1E1B15] border-b border-[#2E2A21] px-4 py-3 mx-2 mt-2 rounded-[2px] space-y-2"
          role="dialog"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile Primary">
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className={`text-left px-3 py-2 min-h-[44px] flex items-center font-mono text-sm border-l-2 rounded-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D] ${
                    isActive
                      ? 'border-[#E8A33D] text-[#E8A33D] bg-[#16140F]'
                      : 'border-transparent text-[#B9B09A] hover:text-[#F1E9D2] hover:bg-[#16140F]'
                  }`}
                  aria-current={isActive ? 'location' : undefined}
                >
                  $ cd ~/{link.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-[#2E2A21]">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                window.dispatchEvent(new CustomEvent('open-command-palette'));
              }}
              className="w-full text-left font-mono text-xs text-[#B9B09A] hover:text-[#F1E9D2] border border-[#2E2A21] hover:border-[#E8A33D] bg-[#16140F] px-3 py-2.5 rounded-[2px] min-h-[44px] flex items-center justify-between transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2"
              aria-label="Ctrl K (Command Palette)"
              aria-haspopup="dialog"
              aria-expanded={paletteOpen}
            >
              <span>Ctrl K (Command Palette)</span>
              <span className="text-[#E8A33D]">&gt;</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
