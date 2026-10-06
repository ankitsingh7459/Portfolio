import { describe, it, expect } from 'vitest';
import { generateSitemap, generateRobotsTxt } from '../seo';

describe('SEO Generators (Pure Logic)', () => {
  it('generates valid sitemap.xml containing root and printapm case study routes', () => {
    const sitemap = generateSitemap('https://example.com');

    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/projects/printapm</loc>');
    expect(sitemap).toContain('<priority>1.0</priority>');
    expect(sitemap).toContain('<priority>0.8</priority>');
  });

  it('normalizes trailing slashes in sitemap siteUrl', () => {
    const sitemap = generateSitemap('https://example.com///');
    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/projects/printapm</loc>');
  });

  it('falls back to placeholder domain when siteUrl is empty or unprovided', () => {
    const sitemap = generateSitemap('');
    expect(sitemap).toContain('<loc>[FILL: domain]/</loc>');
    expect(sitemap).toContain('<loc>[FILL: domain]/projects/printapm</loc>');
  });

  it('generates robots.txt referencing the sitemap', () => {
    const robots = generateRobotsTxt('https://example.com');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://example.com/sitemap.xml');
  });

  it('falls back to placeholder domain in robots.txt when siteUrl is empty', () => {
    const robots = generateRobotsTxt('');
    expect(robots).toContain('Sitemap: [FILL: domain]/sitemap.xml');
  });
});
