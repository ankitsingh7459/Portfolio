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

  it('displays last updated indicator and never renders an iframe', () => {
    const { container } = renderResume();
    expect(
      screen.getByText((content) =>
        content.includes('last updated:') && content.includes(resumeData.lastUpdated)
      )
    ).toBeInTheDocument();
    expect(container.querySelector('iframe')).toBeNull();
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
