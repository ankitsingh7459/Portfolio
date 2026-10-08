import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../data/site';

/**
 * Custom hook to update document title, description, canonical link,
 * and robots meta tag per route.
 *
 * @param {object} options
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {string} [options.canonicalPath]
 * @param {boolean} [options.noindex=false]
 */
export const usePageMeta = ({
  title,
  description,
  canonicalPath,
  noindex = false,
} = {}) => {
  const location = useLocation();

  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title;
    }

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : null;
    if (description && metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Canonical link
    const linkCanonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = linkCanonical ? linkCanonical.getAttribute('href') : null;
    if (linkCanonical) {
      const path = canonicalPath ?? location.pathname;
      const fullCanonical = `${SITE_URL}${path === '/' ? '/' : path}`;
      linkCanonical.setAttribute('href', fullCanonical);
    }

    // Robots noindex
    let metaRobots = document.querySelector('meta[name="robots"]');
    let createdRobots = false;
    if (noindex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
        createdRobots = true;
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc !== null) {
        metaDesc.setAttribute('content', prevDesc);
      }
      if (linkCanonical && prevCanonical !== null) {
        linkCanonical.setAttribute('href', prevCanonical);
      }
      if (createdRobots && metaRobots) {
        metaRobots.remove();
      } else if (metaRobots && noindex) {
        metaRobots.removeAttribute('content');
      }
    };
  }, [title, description, canonicalPath, noindex, location.pathname]);
};

export default usePageMeta;
