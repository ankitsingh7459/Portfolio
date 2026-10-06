import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Log } from '../Log';
import { timelineEntries } from '../../../data/timeline';

const renderLog = () => {
  return render(
    <LazyMotion features={domAnimation}>
      <Log />
    </LazyMotion>
  );
};

describe('Log Component', () => {
  it('renders section heading with git log --oneline command', async () => {
    renderLog();
    await waitFor(() => {
      expect(screen.getByText('git log --oneline')).toBeInTheDocument();
    });
  });

  it('renders milestones with decorative hashes hidden from screen readers', () => {
    const { container } = renderLog();
    if (timelineEntries.length > 0) {
      timelineEntries.forEach((entry) => {
        expect(screen.getByText(entry.title)).toBeInTheDocument();
      });
      const hashes = container.querySelectorAll('[aria-hidden="true"]');
      expect(hashes.length).toBeGreaterThan(0);
    }
  });

  it('ensures no credential link has href="#" or empty href', () => {
    const { container } = renderLog();
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).not.toBe('#');
      expect(href).not.toBe('');
      expect(href).not.toBeNull();
    });
  });
});
