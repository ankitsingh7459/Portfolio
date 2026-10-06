import { heroData } from '../../data/hero';

export const Hero = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="section-padding min-h-[70vh] flex flex-col justify-center py-20"
      aria-label="Introduction"
    >
      <div className="max-w-3xl space-y-6">
        {/* Terminal Prompt */}
        <p className="font-mono text-xs md:text-sm text-[#B9B09A]">
          <span className="text-[#E8A33D] select-none">$ </span>
          <span>{heroData.prompt}</span>
        </p>

        {/* Name / Heading */}
        <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F1E9D2]">
          {heroData.name}
        </h1>

        {/* Descriptor */}
        <p className="font-mono text-sm md:text-base text-[#B9B09A]">
          {heroData.descriptor}
        </p>

        {/* Hero Line */}
        <p className="font-sans text-base md:text-lg text-[#F1E9D2] leading-relaxed max-w-2xl">
          {heroData.heroLine}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
