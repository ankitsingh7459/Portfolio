import { NAV_TARGETS } from '../../lib/navTargets';
import { DEFAULT_PROJECTS } from '../../data/projects';
import { resumeData } from '../../data/resume';
import { contactData } from '../../data/contact';

const isRealUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  const placeholderTag = '[' + 'FILL';
  if (
    trimmed === '' ||
    trimmed === '#' ||
    trimmed.startsWith(placeholderTag) ||
    trimmed.includes(placeholderTag) ||
    trimmed === 'null' ||
    trimmed === 'undefined'
  ) {
    return false;
  }
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/')
  );
};

export const getCommandPaletteItems = () => {
  const items = [];

  // 1. Sections and routes from NAV_TARGETS
  NAV_TARGETS.forEach((target) => {
    if (target.id === 'resume') {
      if (!resumeData?.available || !isRealUrl(resumeData?.filePath)) {
        return;
      }
    }
    items.push({
      id: `nav-${target.id}`,
      label: target.label,
      category: 'Navigation',
      description: target.description,
      type: target.type,
      target: target.target,
    });
  });

  // 2. Projects from DEFAULT_PROJECTS with real links only
  DEFAULT_PROJECTS.forEach((proj) => {
    if (isRealUrl(proj.liveUrl)) {
      items.push({
        id: `proj-live-${proj.slug || proj._id}`,
        label: `${proj.title} (Live Site)`,
        category: 'Projects',
        description: `Visit live application for ${proj.title}`,
        type: 'external',
        target: proj.liveUrl,
      });
    }
    if (isRealUrl(proj.githubUrl)) {
      items.push({
        id: `proj-repo-${proj.slug || proj._id}`,
        label: `${proj.title} (Source Code)`,
        category: 'Projects',
        description: `View repository for ${proj.title}`,
        type: 'external',
        target: proj.githubUrl,
      });
    }
  });

  // 3. Resume open/download actions if valid
  if (resumeData?.available && isRealUrl(resumeData?.filePath)) {
    items.push({
      id: 'resume-open',
      label: 'Open Resume (PDF)',
      category: 'Resume',
      description: 'Open resume in new browser tab',
      type: 'external',
      target: resumeData.filePath,
    });
    items.push({
      id: 'resume-download',
      label: 'Download Resume (PDF)',
      category: 'Resume',
      description: 'Download local resume copy',
      type: 'download',
      target: resumeData.filePath,
      filename: 'Ankit_Singh_Resume.pdf',
    });
  }

  // 4. GitHub profile link
  if (isRealUrl(contactData?.githubUrl)) {
    items.push({
      id: 'contact-github',
      label: 'GitHub Profile',
      category: 'Links',
      description: 'View GitHub profile and repositories',
      type: 'external',
      target: contactData.githubUrl,
    });
  }

  // 5. Email if confirmed real value exists
  const placeholderTag = '[' + 'FILL';
  if (
    contactData?.email &&
    typeof contactData.email === 'string' &&
    !contactData.email.includes(placeholderTag) &&
    isRealUrl(`mailto:${contactData.email}`)
  ) {
    items.push({
      id: 'contact-email',
      label: `Email (${contactData.email})`,
      category: 'Contact',
      description: 'Send direct email message',
      type: 'external',
      target: `mailto:${contactData.email}`,
    });
  }

  return items;
};
