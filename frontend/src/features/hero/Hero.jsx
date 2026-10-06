import { useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import { heroData } from '../../data/hero';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const Hero = () => {
  const prefersReduced = useReducedMotion();

  // State for typing animation
  const [currentLine, setCurrentLine] = useState(prefersReduced ? 4 : 0);
  const [displayedPrompt, setDisplayedPrompt] = useState(prefersReduced ? heroData.prompt : '');
  const [displayedName, setDisplayedName] = useState(prefersReduced ? heroData.name : '');
  const [displayedDescriptor, setDisplayedDescriptor] = useState(prefersReduced ? heroData.descriptor : '');
  const [displayedHeroLine, setDisplayedHeroLine] = useState(prefersReduced ? heroData.heroLine : '');

  // Skip handler
  const skipAnimation = useCallback(() => {
    setDisplayedPrompt(heroData.prompt);
    setDisplayedName(heroData.name);
    setDisplayedDescriptor(heroData.descriptor);
    setDisplayedHeroLine(heroData.heroLine);
    setCurrentLine(4);
  }, []);

  // Listen for keydown or click to skip
  useEffect(() => {
    if (prefersReduced || currentLine >= 4) return;

    const handleKeyDown = () => skipAnimation();
    window.addEventListener('keydown', handleKeyDown, { once: true });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prefersReduced, currentLine, skipAnimation]);

  // Sequential typing effect
  useEffect(() => {
    if (prefersReduced || currentLine >= 4) return;

    let timer = null;

    if (currentLine === 0) {
      // Type Prompt
      let idx = 0;
      timer = setInterval(() => {
        idx += 1;
        setDisplayedPrompt(heroData.prompt.slice(0, idx));
        if (idx >= heroData.prompt.length) {
          clearInterval(timer);
          setTimeout(() => setCurrentLine(1), 150);
        }
      }, 25);
    } else if (currentLine === 1) {
      // Type Name
      let idx = 0;
      timer = setInterval(() => {
        idx += 1;
        setDisplayedName(heroData.name.slice(0, idx));
        if (idx >= heroData.name.length) {
          clearInterval(timer);
          setTimeout(() => setCurrentLine(2), 120);
        }
      }, 35);
    } else if (currentLine === 2) {
      // Type Descriptor
      let idx = 0;
      timer = setInterval(() => {
        idx += 1;
        setDisplayedDescriptor(heroData.descriptor.slice(0, idx));
        if (idx >= heroData.descriptor.length) {
          clearInterval(timer);
          setTimeout(() => setCurrentLine(3), 100);
        }
      }, 20);
    } else if (currentLine === 3) {
      // Type Hero Line
      let idx = 0;
      timer = setInterval(() => {
        idx += 1;
        setDisplayedHeroLine(heroData.heroLine.slice(0, idx));
        if (idx >= heroData.heroLine.length) {
          clearInterval(timer);
          setTimeout(() => setCurrentLine(4), 100);
        }
      }, 15);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentLine, prefersReduced]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isComplete = prefersReduced || currentLine >= 4;

  return (
    <section
      id="hero"
      onClick={isComplete ? undefined : skipAnimation}
      className="section-padding min-h-[70vh] flex flex-col justify-center py-20 cursor-default"
      aria-label="Introduction"
    >
      {/* Screen Reader Full Text (Present on first render for crawlers & assistive tech) */}
      <div className="sr-only">
        <h2>{heroData.prompt}</h2>
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
        <div className="min-h-[2.5rem] md:min-h-[3.75rem] flex items-center">
          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F1E9D2]">
            {displayedName}
          </h1>
          {currentLine === 1 && (
            <span className="cursor-block ml-1 text-[#E8A33D] text-4xl sm:text-5xl md:text-6xl">▍</span>
          )}
        </div>

        {/* Descriptor */}
        <p className="font-mono text-sm md:text-base text-[#B9B09A] min-h-[1.5rem] flex items-center">
          <span>{displayedDescriptor}</span>
          {currentLine === 2 && (
            <span className="cursor-block ml-1 text-[#E8A33D]">▍</span>
          )}
        </p>

        {/* Hero Line */}
        <p className="font-sans text-base md:text-lg text-[#F1E9D2] leading-relaxed max-w-2xl min-h-[2rem] flex items-center flex-wrap">
          <span>{displayedHeroLine}</span>
          {currentLine === 3 && (
            <span className="cursor-block ml-1 text-[#E8A33D]">▍</span>
          )}
        </p>
      </div>

      {/* Actions (Always accessible and clickable, smooth opacity transition) */}
      <m.div
        className="max-w-3xl flex flex-wrap items-center gap-4 pt-8"
        initial={false}
        animate={{ opacity: isComplete ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      >
        <button
          type="button"
          onClick={() => scrollTo(heroData.primaryAction.targetId)}
          className="rounded-[2px] bg-[#E8A33D] px-5 py-2.5 font-mono text-sm font-semibold text-[#16140F] hover:bg-[#d49332] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
        >
          {heroData.primaryAction.label}
        </button>

        <a
          href={heroData.secondaryAction.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[2px] border border-[#2E2A21] bg-[#1E1B15] px-5 py-2.5 font-mono text-sm text-[#B9B09A] hover:text-[#F1E9D2] hover:border-[#E8A33D] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
        >
          {heroData.secondaryAction.label}
        </a>
      </m.div>
    </section>
  );
};

export default Hero;
