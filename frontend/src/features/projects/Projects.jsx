import { useProjects } from './useProjects';
import { ProjectRow } from './ProjectRow';
import { SectionHeading } from '../../components/SectionHeading';
import { Reveal } from '../../components/Reveal';

export const Projects = () => {
  const { projects, loading, error } = useProjects();

  return (
    <section id="projects" className="section-padding py-20" aria-label="Projects">
      <SectionHeading
        command="ls projects"
        prompt="$"
        description="Production systems, web platforms, and engineering repositories."
      />

      {/* Muted note when showing fallback data due to network / timeout */}
      {error && (
        <p className="font-mono text-xs text-[#B9B09A]/80 mb-4 flex items-center gap-1.5 select-none">
          <span className="text-[#E8A33D]">//</span>
          <span>{error}</span>
        </p>
      )}

      {/* Loading Skeleton Rows (No spinners or glowing elements) */}
      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading projects">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="border border-[#2E2A21] bg-[#16140F] p-5 rounded-[2px] animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-[#2E2A21] rounded-[2px] w-48" />
                <div className="h-4 bg-[#1E1B15] rounded-[2px] w-3/4" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 bg-[#1E1B15] rounded-[2px] w-16" />
                <div className="h-6 bg-[#1E1B15] rounded-[2px] w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-[#2E2A21] bg-[#16140F] p-8 text-center font-mono text-sm text-[#B9B09A] rounded-[2px]">
          [Empty: No projects found]
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <Reveal key={project._id || project.slug || project.title} delay={index * 0.06}>
              <ProjectRow project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
