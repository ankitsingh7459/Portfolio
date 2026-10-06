import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { printApmCaseStudy } from '../data/printapm';
import { Screenshot } from '../features/case-study/Screenshot';
import { usePageMeta } from '../hooks/usePageMeta';

export const PrintApmCaseStudy = () => {
  const headingRef = useRef(null);

  usePageMeta({
    title: 'PrintAPM Case Study | Ankit Singh',
    description: 'Engineering case study of the PrintAPM offline kiosk system and distributed architecture.',
    canonicalPath: '/projects/printapm',
  });

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <main className="section-padding py-16 md:py-24 space-y-12 max-w-4xl mx-auto">
        {/* Navigation Breadcrumb / cd .. */}
        <nav aria-label="Breadcrumb">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs md:text-sm text-[#B9B09A] hover:text-[#E8A33D] focus-visible:outline-2 focus-visible:outline-[#E8A33D] rounded-[2px] transition-colors"
          >
            <span className="text-[#E8A33D] select-none">&lt;</span>
            <span>cd .. (Return to Portfolio)</span>
          </Link>
        </nav>

        {/* Header Terminal Header */}
        <header className="space-y-4 border-b border-[#2E2A21] pb-8">
          <p className="font-mono text-xs md:text-sm text-[#B9B09A]">
            <span className="text-[#E8A33D] select-none">$ </span>
            <span>cat README.md</span>
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F1E9D2] outline-none"
          >
            {printApmCaseStudy.title}
          </h1>
          <p className="font-sans text-base md:text-lg text-[#B9B09A]">
            {printApmCaseStudy.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <span className="font-mono text-xs border border-[#2E2A21] bg-[#1E1B15] text-[#B9B09A] px-2.5 py-1 rounded-[2px]">
              Role: {printApmCaseStudy.role}
            </span>
            <span className="font-mono text-xs border border-[#E8A33D]/40 text-[#E8A33D] px-2.5 py-1 rounded-[2px]">
              {printApmCaseStudy.badge}
            </span>
          </div>
        </header>

        {/* 1. Problem */}
        <section className="space-y-3" aria-labelledby="problem-heading">
          <h2 id="problem-heading" className="font-mono text-sm text-[#E8A33D]">
            $ cat problem.txt
          </h2>
          <div className="border border-[#2E2A21] bg-[#1E1B15] p-5 md:p-6 rounded-[2px] font-mono text-sm text-[#B9B09A] leading-relaxed">
            {printApmCaseStudy.problemText}
          </div>
        </section>

        {/* 2. Solution */}
        <section className="space-y-3" aria-labelledby="solution-heading">
          <h2 id="solution-heading" className="font-mono text-sm text-[#E8A33D]">
            $ cat solution.txt
          </h2>
          <div className="border border-[#2E2A21] bg-[#1E1B15] p-5 md:p-6 rounded-[2px] font-mono text-sm text-[#B9B09A] leading-relaxed">
            {printApmCaseStudy.solutionText}
          </div>
        </section>

        {/* 3. Stats */}
        <section className="space-y-3" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="font-mono text-sm text-[#E8A33D]">
            $ cat stats.json
          </h2>
          <div className="border border-[#2E2A21] bg-[#1E1B15] p-5 md:p-6 rounded-[2px] overflow-x-auto">
            <pre className="font-mono text-xs sm:text-sm text-[#F1E9D2] leading-relaxed">
              {JSON.stringify(printApmCaseStudy.statsJson, null, 2)}
            </pre>
          </div>
        </section>

        {/* 4. Architecture (High-level 4-step flow only) */}
        <section className="space-y-3" aria-labelledby="architecture-heading">
          <h2 id="architecture-heading" className="font-mono text-sm text-[#E8A33D]">
            $ cat architecture.md
          </h2>
          <div className="border border-[#2E2A21] bg-[#1E1B15] p-5 md:p-6 rounded-[2px] space-y-4">
            <p className="font-mono text-xs text-[#B9B09A]">
              // High-level system interaction flow (no internal endpoints or secret references)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {printApmCaseStudy.architectureSteps.map((step, idx) => (
                <div
                  key={step.step}
                  className="border border-[#2E2A21] bg-[#16140F] p-4 rounded-[2px] flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-[#E8A33D]">0{step.step}.</span>
                    <h3 className="font-mono text-sm font-semibold text-[#F1E9D2] mt-1.5">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs text-[#B9B09A] mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {idx < 3 && (
                    <div
                      className="mt-4 text-[#E8A33D] font-mono text-center hidden lg:block select-none"
                      aria-hidden="true"
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Decisions */}
        <section className="space-y-3" aria-labelledby="decisions-heading">
          <h2 id="decisions-heading" className="font-mono text-sm text-[#E8A33D]">
            $ cat decisions.md
          </h2>
          <div className="border border-[#2E2A21] bg-[#1E1B15] p-5 md:p-6 rounded-[2px] space-y-4">
            {printApmCaseStudy.decisions.map((item) => (
              <div key={item.title} className="border-l-2 border-[#E8A33D] pl-4 py-1">
                <h3 className="font-mono text-sm font-semibold text-[#F1E9D2]">
                  {item.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#B9B09A] mt-1 leading-relaxed">
                  {item.decision}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Lessons */}
        <section className="space-y-3" aria-labelledby="lessons-heading">
          <h2 id="lessons-heading" className="font-mono text-sm text-[#E8A33D]">
            $ cat lessons.txt
          </h2>
          <div className="border border-[#2E2A21] bg-[#1E1B15] p-5 md:p-6 rounded-[2px] font-mono text-sm text-[#B9B09A] leading-relaxed">
            {printApmCaseStudy.lessonsText}
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="space-y-3" aria-labelledby="screenshots-heading">
          <h2 id="screenshots-heading" className="font-mono text-sm text-[#E8A33D]">
            $ ls -la ./screenshots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {printApmCaseStudy.screenshots.map((screen) => (
              <Screenshot
                key={screen.id}
                src={screen.src}
                alt={screen.alt}
                caption={screen.caption}
              />
            ))}
          </div>
        </section>

        {/* 7. Primary Action: Launch Button */}
        <section className="pt-6 border-t border-[#2E2A21] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <a
            href={printApmCaseStudy.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] bg-[#E8A33D] px-6 py-3 font-mono text-sm font-semibold text-[#16140F] hover:bg-[#d49332] transition-colors focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 min-h-[44px] inline-flex items-center justify-center cursor-pointer shadow-none"
          >
            ./launch printapm.online ↗
          </a>

          <Link
            to="/"
            className="font-mono text-xs text-[#B9B09A] hover:text-[#E8A33D] focus-visible:outline-2 focus-visible:outline-[#E8A33D] transition-colors py-2"
          >
            cd ~ (Back to home)
          </Link>
        </section>
      </main>
    </Layout>
  );
};

export default PrintApmCaseStudy;
