import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Resume } from '../Resume';
import { resumeData } from '../../../data/resume';

const renderResume = () => {
  return render(
    <LazyMotion features={domAnimation}>
      <Resume />
    </LazyMotion>
  );
};

describe('Resume Component', () => {
  it('renders section heading with cat resume.pdf command', async () => {
    renderResume();
    await waitFor(() => {
      expect(screen.getByText('cat resume.pdf')).toBeInTheDocument();
    });
  });

  it('renders open action with correct href, target, and rel', () => {
    renderResume();
    const openLink = screen.getByRole('link', { name: /open/i });
    expect(openLink).toBeInTheDocument();
    expect(openLink).toHaveAttribute('href', resumeData.filePath);
    expect(openLink).toHaveAttribute('target', '_blank');
    expect(openLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders download action with correct href and download attribute', () => {
    renderResume();
    const downloadLink = screen.getByRole('link', { name: /download/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', resumeData.filePath);
    expect(downloadLink).toHaveAttribute('download');
  });

  it('omits last updated indicator when lastUpdated is missing or placeholder', () => {
    const { container } = renderResume();
    expect(
      screen.queryByText((content) => content.includes('last updated:'))
    ).toBeNull();
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('renders last updated indicator when a valid date is provided', async () => {
    const originalDate = resumeData.lastUpdated;
    resumeData.lastUpdated = 'October 2026';
    renderResume();
    expect(
      screen.getByText((content) =>
        content.includes('last updated:') && content.includes('October 2026')
      )
    ).toBeInTheDocument();
    resumeData.lastUpdated = originalDate;
  });

  it('returns null and renders nothing when resumeData.available is false or filePath is missing/invalid', () => {
    const originalAvailable = resumeData.available;
    const originalPath = resumeData.filePath;

    resumeData.available = false;
    const { container: c1 } = renderResume();
    expect(c1.firstChild).toBeNull();

    resumeData.available = true;
    resumeData.filePath = null;
    const { container: c2 } = renderResume();
    expect(c2.firstChild).toBeNull();

    resumeData.filePath = '#';
    const { container: c3 } = renderResume();
    expect(c3.firstChild).toBeNull();

    resumeData.filePath = '[' + 'FILL: /path]';
    const { container: c4 } = renderResume();
    expect(c4.firstChild).toBeNull();

    resumeData.available = originalAvailable;
    resumeData.filePath = originalPath;
  });

  it('ensures no rendered link has href="#" or empty href', () => {
    const { container } = renderResume();
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).not.toBe('#');
      expect(href).not.toBe('');
      expect(href).not.toBeNull();
    });
  });
});

