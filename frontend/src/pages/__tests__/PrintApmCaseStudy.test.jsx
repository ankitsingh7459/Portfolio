import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { PrintApmCaseStudy } from '../PrintApmCaseStudy';
import { printApmCaseStudy } from '../../data/printapm';

const renderCaseStudy = () => {
  return render(
    <MemoryRouter initialEntries={['/projects/printapm']}>
      <LazyMotion features={domAnimation}>
        <PrintApmCaseStudy />
      </LazyMotion>
    </MemoryRouter>
  );
};

// Minimal 404 test app matching App.jsx
const NotFoundTestComponent = () => (
  <div data-testid="not-found">
    <p>$ 404: command not found</p>
    <Link to="/">cd ~</Link>
  </div>
);

describe('PrintApmCaseStudy Page', () => {
  it('renders verified terminal sections from data/printapm.js and omits unverified sections', () => {
    renderCaseStudy();

    // Check headings and content
    expect(screen.getByText(/cat README\.md/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: printApmCaseStudy.title })).toBeInTheDocument();

    expect(screen.getByText('$ cat problem.txt')).toBeInTheDocument();
    expect(screen.getByText(printApmCaseStudy.problemText)).toBeInTheDocument();

    expect(screen.getByText('$ cat solution.txt')).toBeInTheDocument();
    expect(screen.getByText(printApmCaseStudy.solutionText)).toBeInTheDocument();

    // Unverified sections should be omitted when null or empty
    if (!printApmCaseStudy.statsJson) {
      expect(screen.queryByText('$ cat stats.json')).toBeNull();
    }
    if (!printApmCaseStudy.architectureSteps?.length) {
      expect(screen.queryByText('$ cat architecture.md')).toBeNull();
    }
    if (!printApmCaseStudy.decisions?.length) {
      expect(screen.queryByText('$ cat decisions.md')).toBeNull();
    }
    if (!printApmCaseStudy.lessonsText) {
      expect(screen.queryByText('$ cat lessons.txt')).toBeNull();
    }
    if (!printApmCaseStudy.screenshots?.length) {
      expect(screen.queryByText('$ ls -la ./screenshots')).toBeNull();
    }
  });

  it('renders live link button with correct URL and rel="noopener noreferrer"', () => {
    renderCaseStudy();

    const liveBtn = screen.getByRole('link', { name: /printapm\.online/i });
    expect(liveBtn).toBeInTheDocument();
    expect(liveBtn).toHaveAttribute('href', 'https://printapm.online');
    expect(liveBtn).toHaveAttribute('target', '_blank');
    expect(liveBtn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('updates document.title on mount', async () => {
    renderCaseStudy();
    await waitFor(() => {
      expect(document.title).toBe('PrintAPM Case Study | Ankit Singh');
    });
  });

  it('renders 404 terminal fallback on unknown route without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-nonexistent-path']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/projects/printapm" element={<PrintApmCaseStudy />} />
          <Route path="*" element={<NotFoundTestComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.getByText(/404: command not found/i)).toBeInTheDocument();
  });
});
