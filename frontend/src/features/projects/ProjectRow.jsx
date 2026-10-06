import { Link } from 'react-router-dom';
import { m } from 'framer-motion';

export const ProjectRow = ({ project }) => {
  return (
    <m.article
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5 border border-[#2E2A21] bg-[#16140F] hover:border-[#E8A33D] focus-within:border-[#E8A33D] transition-colors rounded-[2px]"
    >
      {/* Left: Indicator, Title & Description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          {/* Amber prompt indicator on hover / focus */}
          <span
            className="text-[#E8A33D] font-mono text-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity select-none"
            aria-hidden="true"
          >
            &gt;
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {project.caseStudyUrl ? (
              <Link
                to={project.caseStudyUrl}
                className="font-mono text-base md:text-lg font-semibold text-[#F1E9D2] hover:text-[#E8A33D] focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] transition-colors"
              >
                {project.title}
              </Link>
            ) : (
              <h3 className="font-mono text-base md:text-lg font-semibold text-[#F1E9D2]">
                {project.title}
              </h3>
            )}

            {project.featured && (
              <span className="font-mono text-[10px] tracking-wider uppercase border border-[#E8A33D]/50 text-[#E8A33D] px-1.5 py-0.5 rounded-[2px] select-none">
                featured
              </span>
            )}
          </div>
        </div>

        <p className="mt-1.5 font-sans text-sm text-[#B9B09A] line-clamp-2 md:line-clamp-1 max-w-3xl pl-5">
          {project.description}
        </p>
      </div>

      {/* Right: Tech Tags & Links */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 pl-5 md:pl-0 shrink-0">
        {/* Tech tags: mono, bordered, no fill */}
        <div className="flex flex-wrap items-center gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs border border-[#2E2A21] text-[#B9B09A] px-2 py-0.5 rounded-[2px]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action links */}
        <div className="flex items-center gap-3 ml-auto md:ml-2">
          {project.caseStudyUrl && (
            <Link
              to={project.caseStudyUrl}
              className="font-mono text-xs text-[#E8A33D] hover:underline focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] whitespace-nowrap"
            >
              Case Study →
            </Link>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#B9B09A] hover:text-[#E8A33D] focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] whitespace-nowrap"
            >
              Code ↗
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#E8A33D] hover:underline focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] whitespace-nowrap"
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </m.article>
  );
};

export default ProjectRow;
