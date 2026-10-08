import { useState, useEffect } from 'react';
import { getProjects } from '../../services/api';
import { DEFAULT_PROJECTS } from '../../data/projects';
import { printApmProject } from '../../data/printapm';

export const normalizeProject = (project) => {
  const sanitizeUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (trimmed === '#' || trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
      return null;
    }
    return trimmed;
  };

  let techStack = project.techStack ?? project.tech_stack ?? [];
  if (typeof techStack === 'string') {
    try {
      techStack = JSON.parse(techStack);
    } catch {
      techStack = techStack.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }

  const title = project.title || 'Untitled Project';
  const slug =
    project.slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  return {
    ...project,
    _id: project._id ?? project.id ?? slug,
    slug,
    title,
    description: project.description || '',
    techStack: Array.isArray(techStack) ? techStack : [],
    githubUrl: sanitizeUrl(project.githubUrl ?? project.github_url),
    liveUrl: sanitizeUrl(project.liveUrl ?? project.live_url),
    featured: Boolean(project.featured),
    caseStudyUrl: project.caseStudyUrl ?? (slug === 'printapm' ? '/projects/printapm' : null),
  };
};

export const mergeWithPrintApm = (apiProjects = []) => {
  const normalizedApi = (Array.isArray(apiProjects) ? apiProjects : []).map(normalizeProject);
  // Remove any duplicate PrintAPM entry from API results to ensure local featured PrintAPM stays first
  const nonPrintApm = normalizedApi.filter(
    (p) => p.slug !== 'printapm' && p.title.toLowerCase() !== 'printapm'
  );
  return [normalizeProject(printApmProject), ...nonPrintApm];
};

/**
 * Hook to fetch projects with 4s timeout, error handling, and local fallback.
 * @param {number} timeoutMs
 */
export const useProjects = (timeoutMs = 4000) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timer = null;

    const applyFallback = (errReason = null) => {
      if (!isMounted) return;
      setProjects(DEFAULT_PROJECTS.map(normalizeProject));
      setIsFallback(true);
      if (errReason) setError(errReason);
      setLoading(false);
    };

    // 4-second timeout fallback per PRD/DESIGN
    timer = setTimeout(() => {
      if (isMounted) {
        applyFallback('Connection timed out. Showing saved archive.');
      }
    }, timeoutMs);

    getProjects()
      .then((res) => {
        if (!isMounted) return;
        clearTimeout(timer);
        const data = res.data?.data || res.data?.projects || res.data;
        if (Array.isArray(data) && data.length > 0) {
          const merged = mergeWithPrintApm(data);
          setProjects(merged);
          setIsFallback(false);
          setError(null);
        } else {
          applyFallback('Service unavailable. Showing saved archive.');
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        clearTimeout(timer);
        applyFallback('API unavailable. Showing saved archive.');
      });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [timeoutMs]);

  return { projects, loading, error, isFallback };
};

export default useProjects;
