import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Log } from '../Log';
import { timelineEntries } from '../../../data/timeline';
import { certifications } from '../../../data/certifications';

const renderLog = () => {
  return render(
    <LazyMotion features={domAnimation}>
      <Log />
    </LazyMotion>
  );
};

describe('Log Component', () => {
  it('omits section and returns null when empty per ADR-012, or renders heading when entries exist', () => {
    const { container } = renderLog();
    if (timelineEntries.length === 0 && certifications.length === 0) {
      expect(container.firstChild).toBeNull();
    } else {
      expect(screen.getByText('git log --oneline')).toBeInTheDocument();
    }
  });

  it('renders milestones with decorative hashes hidden from screen readers when entries exist', () => {
    const { container } = renderLog();
    if (timelineEntries.length > 0) {
      timelineEntries.forEach((entry) => {
        expect(screen.getByText(entry.title)).toBeInTheDocument();
      });
      const hashes = container.querySelectorAll('[aria-hidden="true"]');
      expect(hashes.length).toBeGreaterThan(0);
    } else {
      expect(container.firstChild).toBeNull();
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
