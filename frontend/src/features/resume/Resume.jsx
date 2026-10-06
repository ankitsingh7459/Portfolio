import { SectionHeading } from '../../components/SectionHeading';
import { Reveal } from '../../components/Reveal';
import { resumeData } from '../../data/resume';

const isRealUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (
    trimmed === '' ||
    trimmed === '#' ||
    trimmed.startsWith('[FILL') ||
    trimmed.includes('[FILL') ||
    trimmed === 'null' ||
    trimmed === 'undefined'
  ) {
    return false;
  }
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  );
};

export const Resume = () => {
  if (
    !resumeData ||
    !resumeData.available ||
    !resumeData.filePath ||
    !isRealUrl(resumeData.filePath)
  ) {
    return null;
  }

  const hasLastUpdated =
    typeof resumeData.lastUpdated === 'string' &&
    resumeData.lastUpdated.trim().length > 0 &&
    !resumeData.lastUpdated.includes('[FILL');

  return (
    <section id="resume" className="section-padding py-20" aria-label="Resume">
      <SectionHeading
        command={resumeData.heading || 'cat resume.pdf'}
        prompt={resumeData.prompt || '$'}
        description={resumeData.description || 'Verified engineering background, technical experience, and contact details.'}
      />

      <Reveal>
        <div className="border border-[#2E2A21] bg-[#16140F] p-6 md:p-8 rounded-[2px] max-w-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E2A21] pb-4">
            <div className="font-mono text-sm text-[#F1E9D2] flex items-center gap-2">
              <span className="text-[#E8A33D] select-none" aria-hidden="true">
                &gt;
              </span>
              <span className="font-semibold">resume.pdf</span>
            </div>
            {hasLastUpdated && (
              <span className="font-mono text-xs text-[#B9B09A]">
                // last updated: {resumeData.lastUpdated}
              </span>
            )}
          </div>

          <p className="font-sans text-xs text-[#B9B09A]">
            Download or inspect the full document in a separate browser tab.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={resumeData.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs font-semibold bg-[#E8A33D] text-[#16140F] px-5 py-2.5 rounded-[2px] hover:bg-[#E8A33D]/90 min-h-[44px] inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 transition-colors"
            >
              <span>open</span>
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>

            <a
              href={resumeData.filePath}
              download="Ankit_Singh_Resume.pdf"
              className="font-mono text-xs text-[#F1E9D2] border border-[#2E2A21] hover:border-[#E8A33D] px-5 py-2.5 rounded-[2px] min-h-[44px] inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 transition-colors"
            >
              <span>download</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Resume;
