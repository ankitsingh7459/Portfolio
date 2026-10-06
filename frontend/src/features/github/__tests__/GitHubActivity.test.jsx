import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { GitHubActivity } from '../GitHubActivity';
import * as api from '../../../services/api';

vi.mock('../../../services/api');

const renderGitHubActivity = () => {
  return render(
    <LazyMotion features={domAnimation}>
      <GitHubActivity />
    </LazyMotion>
  );
};

describe('GitHubActivity Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders activity from mocked API', async () => {
    api.getGitHubActivity.mockResolvedValueOnce({
      data: {
        username: 'ankitsingh7459',
        stats: { repos: 12, stars: 25, forks: 5 },
        repos: [
          {
            name: 'mock-repo-1',
            description: 'A mock repository for testing.',
            stars: 15,
            forks: 3,
            language: 'TypeScript',
            url: 'https://github.com/ankitsingh7459/mock-repo-1',
          },
        ],
      },
    });

    renderGitHubActivity();

    await waitFor(() => {
      expect(screen.getByText('mock-repo-1')).toBeInTheDocument();
      expect(screen.getByText('A mock repository for testing.')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('renders fallback snapshot and graceful note on API failure', async () => {
    api.getGitHubActivity.mockRejectedValueOnce(new Error('Network failure'));

    renderGitHubActivity();

    await waitFor(() => {
      expect(
        screen.getByText(/Activity service unavailable. Showing local snapshot./i)
      ).toBeInTheDocument();
      // Default snapshot repo
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });
  });

  it('renders rate limit note on 403 or 429 error', async () => {
    const rateLimitError = new Error('Rate limit exceeded');
    rateLimitError.response = { status: 403 };
    api.getGitHubActivity.mockRejectedValueOnce(rateLimitError);

    renderGitHubActivity();

    await waitFor(() => {
      expect(
        screen.getByText(/API rate limit reached. Showing local snapshot./i)
      ).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });
  });

  it('ensures no rendered link has href="#" or empty href', async () => {
    api.getGitHubActivity.mockRejectedValueOnce(new Error('Network failure'));

    const { container } = renderGitHubActivity();

    await waitFor(() => {
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });

    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).not.toBe('#');
      expect(href).not.toBe('');
      expect(href).not.toBeNull();
      expect(href).toMatch(/^https?:\/\//);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
