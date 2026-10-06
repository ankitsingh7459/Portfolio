import { m } from 'framer-motion';
import { SectionHeading } from '../../components/SectionHeading';
import { Reveal } from '../../components/Reveal';
import { useGitHubActivity } from './useGitHubActivity';

export const GitHubActivity = () => {
  const { data, error, loading } = useGitHubActivity(4000);

  return (
    <section id="github" className="section-padding py-20" aria-label="GitHub Activity">
      <SectionHeading
        command="gh activity --user ankitsingh7459"
        prompt="$"
        description="Public open-source repositories and contribution metrics."
      />

      {/* Muted line when service is unavailable or rate limited */}
      {(!data || error) && !loading && (
        <Reveal>
          <div className="border border-[#2E2A21] bg-[#16140F] p-4 rounded-[2px] font-mono text-xs text-[#B9B09A]/80 max-w-4xl mb-6">
            // {error || 'GitHub unavailable.'}
          </div>
        </Reveal>
      )}

      {/* Live repository activity */}
      {data && data.repos && data.repos.length > 0 && (
        <>
          <Reveal>
            <div className="grid grid-cols-3 gap-4 border border-[#2E2A21] bg-[#16140F] p-4 rounded-[2px] mb-6 max-w-4xl font-mono text-center sm:text-left">
              <div>
                <span className="text-[#B9B09A] block text-xs">repos</span>
                <span className="text-[#F1E9D2] text-lg font-semibold">{data.stats?.repos ?? 0}</span>
              </div>
              <div>
                <span className="text-[#B9B09A] block text-xs">stars</span>
                <span className="text-[#F1E9D2] text-lg font-semibold">{data.stats?.stars ?? 0}</span>
              </div>
              <div>
                <span className="text-[#B9B09A] block text-xs">forks</span>
                <span className="text-[#F1E9D2] text-lg font-semibold">{data.stats?.forks ?? 0}</span>
              </div>
            </div>
          </Reveal>

          <div className="space-y-3 max-w-4xl">
            {data.repos.map((repo, idx) => {
              const isRealUrl =
                typeof repo.url === 'string' &&
                repo.url.length > 0 &&
                repo.url !== '#' &&
                repo.url.startsWith('http');

              return (
                <Reveal key={repo.name || idx} delay={idx * 0.05}>
                  <m.article
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-[#2E2A21] bg-[#16140F] hover:border-[#E8A33D] rounded-[2px] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-[#E8A33D] font-mono text-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity select-none"
                          aria-hidden="true"
                        >
                          &gt;
                        </span>
                        {isRealUrl ? (
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm md:text-base font-semibold text-[#F1E9D2] hover:text-[#E8A33D] focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] transition-colors inline-flex items-center gap-1.5"
                          >
                            <span>{repo.name}</span>
                            <span className="text-[#E8A33D] text-xs select-none" aria-hidden="true">
                              ↗
                            </span>
                          </a>
                        ) : (
                          <h3 className="font-mono text-sm md:text-base font-semibold text-[#F1E9D2]">
                            {repo.name}
                          </h3>
                        )}
                      </div>
                      {repo.description && (
                        <p className="font-sans text-xs text-[#B9B09A] mt-1 pl-4">
                          {repo.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pl-4 sm:pl-0 shrink-0">
                      {repo.language && (
                        <span className="font-mono text-xs border border-[#2E2A21] text-[#B9B09A] px-2 py-0.5 rounded-[2px]">
                          {repo.language}
                        </span>
                      )}
                      <div className="flex items-center gap-3 font-mono text-xs text-[#B9B09A]">
                        <span title="Stars" className="flex items-center gap-1">
                          <span className="text-[#E8A33D]" aria-hidden="true">
                            ★
                          </span>
                          <span>{repo.stars ?? 0}</span>
                        </span>
                        <span title="Forks" className="flex items-center gap-1">
                          <span aria-hidden="true">⑂</span>
                          <span>{repo.forks ?? 0}</span>
                        </span>
                      </div>
                    </div>
                  </m.article>
                </Reveal>
              );
            })}
          </div>
        </>
      )}

      {/* Direct profile link */}
      <Reveal delay={0.2}>
        <div className="mt-6">
          <a
            href={`https://github.com/${data?.username || 'ankitsingh7459'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#E8A33D] hover:underline focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] inline-flex items-center gap-1.5"
          >
            <span>View all on GitHub</span>
            <span>→</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
};

export default GitHubActivity;
