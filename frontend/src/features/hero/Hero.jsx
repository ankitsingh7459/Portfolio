import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { heroData } from '../../data/hero';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const Terminal = lazy(() => import('../terminal/Terminal'));

export const Hero = () => {
  const prefersReduced = useReducedMotion();
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );

  // State for typing animation
  // State for typing animation (prompt line types; name and content painted immediately for optimal LCP)
  const [currentLine, setCurrentLine] = useState(prefersReduced ? 4 : 0);
  const [displayedPrompt, setDisplayedPrompt] = useState(prefersReduced ? heroData.prompt : '');
  const [displayedName, setDisplayedName] = useState(heroData.name);
  const [displayedDescriptor, setDisplayedDescriptor] = useState(heroData.descriptor);
  const [displayedHeroLine, setDisplayedHeroLine] = useState(heroData.heroLine);

  // Skip handler
  const skipAnimation = useCallback(() => {
    setDisplayedPrompt(heroData.prompt);
    setDisplayedName(heroData.name);
    setDisplayedDescriptor(heroData.descriptor);
    setDisplayedHeroLine(heroData.heroLine);
    setCurrentLine(4);
  }, []);

  // Listen for intentional keydown to skip
  useEffect(() => {
    if (prefersReduced || currentLine >= 4) return;

    const handleKeyDown = (e) => {
      if (e.defaultPrevented) return;
      // Ignore modifier keys and Tab navigation
      if (['Control', 'Shift', 'Alt', 'Meta', 'Tab'].includes(e.key)) return;
      // Do not skip if user is focused inside a form input element
      const target = e.target;
      const tagName = target?.tagName?.toLowerCase();
      if (
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target?.isContentEditable
      ) {
        return;
      }
      skipAnimation();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prefersReduced, currentLine, skipAnimation]);

  // Terminal prompt line typing effect
  useEffect(() => {
    if (prefersReduced || currentLine >= 4) return;

    let timer = null;

    if (currentLine === 0) {
      // Type Prompt ($ whoami)
      let idx = 0;
      timer = setInterval(() => {
        idx += 1;
        setDisplayedPrompt(heroData.prompt.slice(0, idx));
        if (idx >= heroData.prompt.length) {
          clearInterval(timer);
          setTimeout(() => setCurrentLine(4), 150);
        }
      }, 25);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentLine, prefersReduced]);

  useEffect(() => {
    if (!heroRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isComplete = prefersReduced || currentLine >= 4;

  return (
    <section
      id="hero"
      ref={heroRef}
      onClick={isComplete ? undefined : skipAnimation}
      className="section-padding min-h-[70vh] flex flex-col justify-center py-20 cursor-default"
      aria-label="Introduction"
    >
      {/* Screen Reader Full Text (Present on first render for crawlers & assistive tech) */}
      <div className="sr-only">
        <p>{heroData.prompt}</p>
        <h1>{heroData.name}</h1>
        <p>{heroData.descriptor}</p>
        <p>{heroData.heroLine}</p>
      </div>

      {/* Visual Terminal Boot Sequence */}
      <div className="max-w-3xl space-y-6" aria-hidden="true">
        {/* Prompt line */}
        <p className="font-mono text-xs md:text-sm text-[#B9B09A] min-h-[1.5rem] flex items-center">
          <span className="text-[#E8A33D] mr-2 select-none">$</span>
          <span>{displayedPrompt}</span>
          {currentLine === 0 && (
            <span className="cursor-block ml-1 text-[#E8A33D]">▍</span>
          )}
        </p>

        {/* Name / Heading */}
        <div className="min-h-[2.5rem] sm:min-h-[3.25rem] md:min-h-[3.75rem] flex items-center flex-wrap">
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F1E9D2] break-words">
            {displayedName}
          </span>
        </div>

        {/* Descriptor */}
        <p className="font-mono text-sm md:text-base text-[#B9B09A] min-h-[1.5rem] flex items-center">
          <span>{displayedDescriptor}</span>
        </p>

        {/* Hero Line */}
        <p className="font-sans text-base md:text-lg text-[#F1E9D2] leading-relaxed max-w-2xl min-h-[2rem] flex items-center flex-wrap">
          <span>{displayedHeroLine}</span>
        </p>
      </div>

      {/* Actions (Always accessible and clickable with full contrast) */}
      <div className="max-w-3xl flex flex-wrap items-center gap-4 pt-8">
        <button
          type="button"
          onClick={() => scrollTo(heroData.primaryAction.targetId)}
          className="rounded-[2px] bg-[#E8A33D] px-5 py-3 font-mono text-sm font-semibold text-[#16140F] hover:bg-[#d49332] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 min-h-[44px] inline-flex items-center justify-center cursor-pointer"
        >
          {heroData.primaryAction.label}
        </button>

        <a
          href={heroData.secondaryAction.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[2px] border border-[#2E2A21] bg-[#1E1B15] px-5 py-3 font-mono text-sm text-[#B9B09A] hover:text-[#F1E9D2] hover:border-[#E8A33D] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 min-h-[44px] inline-flex items-center justify-center"
        >
          <span>{heroData.secondaryAction.label}</span>
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>

      {/* Collapsed/Expanded Terminal UI under Hero actions */}
      {isComplete && isVisible && (
        <Suspense fallback={null}>
          <Terminal />
        </Suspense>
      )}
    </section>
  );
};

export default Hero;
