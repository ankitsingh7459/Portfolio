/**
 * Pure generator functions for robots.txt and sitemap.xml.
 */

export const generateSitemap = (siteUrl = '') => {
  const cleanUrl = (typeof siteUrl === 'string' ? siteUrl : '').trim().replace(/\/+$/, '');
  const base = cleanUrl || '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${base}/projects/printapm</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
};

export const generateRobotsTxt = (siteUrl = '') => {
  const cleanUrl = (typeof siteUrl === 'string' ? siteUrl : '').trim().replace(/\/+$/, '');
  const base = cleanUrl || '';

  return `User-agent: *
Allow: /

Sitemap: ${base ? `${base}/sitemap.xml` : '/sitemap.xml'}
`;
};
