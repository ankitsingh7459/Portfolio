import { SectionHeading } from '../../components/SectionHeading';
import { Reveal } from '../../components/Reveal';
import { timelineEntries } from '../../data/timeline';
import { certifications } from '../../data/certifications';

export const Log = () => {
  const hasTimeline = timelineEntries && timelineEntries.length > 0;
  const hasCerts = certifications && certifications.length > 0;
  const isEmpty = !hasTimeline && !hasCerts;

  return (
    <section id="log" className="section-padding py-20" aria-label="Engineering Log">
      <SectionHeading
        command="git log --oneline"
        prompt="$"
        description="Chronological engineering milestones and verified credentials."
      />

      {isEmpty ? (
        <div className="border border-[#2E2A21] bg-[#16140F] p-5 rounded-[2px] font-mono text-xs text-[#B9B09A]/80">
          // Note: No log entries recorded.
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl">
          {/* Milestones subsection */}
          {hasTimeline && (
            <div className="space-y-2">
              <p className="font-mono text-xs text-[#B9B09A] mb-3 flex items-center gap-1.5 select-none">
                <span className="text-[#E8A33D]">//</span>
                <span>Milestones</span>
              </p>
              <div className="border border-[#2E2A21] bg-[#16140F] divide-y divide-[#2E2A21] rounded-[2px]">
                {timelineEntries.map((entry, idx) => (
                  <Reveal key={entry.id || idx} delay={idx * 0.05}>
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-[#1E1B15] transition-colors">
                      <div className="flex items-baseline gap-3 min-w-0 flex-1">
                        <span
                          className="font-mono text-xs text-[#E8A33D] select-none shrink-0"
                          aria-hidden="true"
                        >
                          {entry.hash}
                        </span>
                        <div className="min-w-0">
                          <span className="font-mono text-sm font-semibold text-[#F1E9D2] mr-2">
                            {entry.title}
                          </span>
                          <span className="font-sans text-xs text-[#B9B09A]">
                            {entry.description}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#B9B09A] shrink-0 self-start sm:self-center">
                        {entry.date}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Certifications subsection */}
          {hasCerts && (
            <div className="space-y-2">
              <p className="font-mono text-xs text-[#B9B09A] mb-3 flex items-center gap-1.5 select-none">
                <span className="text-[#E8A33D]">//</span>
                <span>Credentials</span>
              </p>
              <div className="border border-[#2E2A21] bg-[#16140F] divide-y divide-[#2E2A21] rounded-[2px]">
                {certifications.map((cert, idx) => (
                  <Reveal key={cert.id || idx} delay={idx * 0.05}>
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-[#1E1B15] transition-colors">
                      <div className="flex items-baseline gap-3 min-w-0 flex-1">
                        <span
                          className="font-mono text-xs text-[#E8A33D] select-none shrink-0"
                          aria-hidden="true"
                        >
                          {cert.hash}
                        </span>
                        <div className="min-w-0">
                          <span className="font-mono text-sm font-semibold text-[#F1E9D2] mr-2">
                            {cert.title}
                          </span>
                          <span className="font-mono text-xs text-[#B9B09A]">
                            [{cert.issuer}]
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                        <span className="font-mono text-xs text-[#B9B09A]">
                          {cert.date}
                        </span>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-[#E8A33D] hover:underline focus-visible:outline-2 focus-visible:outline-[#E8A33D] rounded-[2px]"
                          >
                            verify ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Log;
