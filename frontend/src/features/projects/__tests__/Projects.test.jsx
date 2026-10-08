import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Projects } from '../Projects';
import * as api from '../../../services/api';

vi.mock('../../../services/api');

const renderProjects = () => {
  return render(
    <MemoryRouter>
      <LazyMotion features={domAnimation}>
        <Projects />
      </LazyMotion>
    </MemoryRouter>
  );
};

describe('Projects Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders projects from a mocked API with PrintAPM prepended and featured', async () => {
    api.getProjects.mockResolvedValueOnce({
      data: {
        projects: [
          {
            _id: 'api-1',
            title: 'Cloud Monitor Service',
            description: 'Microservice for tracking metrics.',
            techStack: ['Node.js', 'Docker'],
            githubUrl: 'https://github.com/ankitsingh7459/cloud-monitor',
            liveUrl: 'https://cloud-monitor.example.com',
            featured: false,
          },
        ],
      },
    });

    renderProjects();

    // PrintAPM is ALWAYS first and featured
    await waitFor(() => {
      expect(screen.getByText('PrintAPM')).toBeInTheDocument();
      expect(screen.getByText('Cloud Monitor Service')).toBeInTheDocument();
    });

    // Check featured badge on PrintAPM
    const printApmRow = screen.getByText('PrintAPM').closest('article');
    expect(printApmRow).toHaveTextContent(/featured/i);
  });

  it('renders fallback archive when API fails', async () => {
    api.getProjects.mockRejectedValueOnce(new Error('Network error'));

    renderProjects();

    await waitFor(() => {
      expect(screen.getByText(/showing saved archive/i)).toBeInTheDocument();
      expect(screen.getByText('PrintAPM')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
      expect(screen.getByText('CoSupport')).toBeInTheDocument();
    });
  });

  it('ensures no rendered link has href="#" or empty href', async () => {
    api.getProjects.mockRejectedValueOnce(new Error('Network error'));

    const { container } = renderProjects();

    await waitFor(() => {
      expect(screen.getByText('PrintAPM')).toBeInTheDocument();
    });

    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).not.toBe('#');
      expect(href).not.toBe('');
      expect(href).not.toBeNull();
    });
  });

  it('renders loading skeleton while fetching', () => {
    // Keep promise pending
    api.getProjects.mockImplementationOnce(() => new Promise(() => {}));

    const { container } = renderProjects();
    const loadingContainer = container.querySelector('[aria-busy="true"]');
    expect(loadingContainer).toBeInTheDocument();
  });

  it('prepends PrintAPM even if API returns an empty array', async () => {
    api.getProjects.mockResolvedValueOnce({ data: { projects: [] } });

    renderProjects();

    await waitFor(() => {
      expect(screen.getByText('PrintAPM')).toBeInTheDocument();
    });
  });
});
