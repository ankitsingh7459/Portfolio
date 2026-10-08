import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import Admin from '../Admin';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/api';

vi.mock('../../services/api', () => ({
  getProjects: vi.fn(), loginAdmin: vi.fn(), createProject: vi.fn(),
  updateProject: vi.fn(), deleteProject: vi.fn(),
}));

const fixture = { id: 17, title: 'Session fixture', description: 'Mock project', tech_stack: ['React'] };
const unauthorized = { response: { status: 401 } };
const renderAdmin = () => render(<MemoryRouter><LazyMotion features={domAnimation}><Admin /></LazyMotion></MemoryRouter>);
const expectLogin = async () => {
  await waitFor(() => expect(screen.getByRole('button', { name: '$ authenticate' })).toBeVisible());
  expect(screen.getByRole('alert')).toHaveTextContent('Your session has expired or is invalid. Please sign in again.');
  expect(localStorage.getItem('admin_token')).toBeNull();
  expect(screen.queryByRole('button', { name: 'logout' })).not.toBeInTheDocument();
};

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  localStorage.setItem('admin_token', 'isolated-test-token');
  getProjects.mockResolvedValue({ data: { data: [fixture] } });
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('Admin session regression', () => {
  it('clears an expired persisted session on a confirmed 401 while loading', async () => {
    getProjects.mockRejectedValue(unauthorized);
    renderAdmin();
    await expectLogin();
  });

  for (const operation of ['create', 'update', 'delete', 'refresh']) {
    it(`returns to login on 401 during ${operation}`, async () => {
      renderAdmin();
      await screen.findByRole('heading', { name: fixture.title });
      if (operation === 'delete') {
        deleteProject.mockRejectedValue(unauthorized);
        fireEvent.click(screen.getByRole('button', { name: `Delete ${fixture.title}` }));
      } else {
        if (operation === 'update') {
          updateProject.mockRejectedValue(unauthorized);
          fireEvent.click(screen.getByRole('button', { name: `Edit ${fixture.title}` }));
        } else {
          createProject.mockResolvedValue({ data: {} });
          if (operation === 'create') createProject.mockRejectedValue(unauthorized);
          if (operation === 'refresh') getProjects.mockRejectedValue(unauthorized);
        }
        fireEvent.change(screen.getByPlaceholderText('Project title'), { target: { value: 'Draft' } });
        fireEvent.change(screen.getByPlaceholderText('Project description'), { target: { value: 'Mock draft description' } });
        fireEvent.click(screen.getByRole('button', { name: operation === 'update' ? '$ update' : '$ save' }));
      }
      await expectLogin();
      expect(window.alert).not.toHaveBeenCalled();
    });
  }

  for (const [name, error] of [
    ['network failure', new TypeError('Failed to fetch')],
    ['server error', { response: { status: 500 } }],
    ['permission failure', { response: { status: 403 } }],
  ]) {
    it(`retains the session on ${name} while loading`, async () => {
      getProjects.mockRejectedValue(error);
      renderAdmin();
      await screen.findByText('No projects recorded in database.');
      expect(screen.getByRole('button', { name: 'logout' })).toBeVisible();
      expect(localStorage.getItem('admin_token')).toBe('isolated-test-token');
    });
    it(`retains the session and draft on ${name} while saving`, async () => {
      createProject.mockRejectedValue(error);
      renderAdmin();
      await screen.findByRole('heading', { name: fixture.title });
      fireEvent.change(screen.getByPlaceholderText('Project title'), { target: { value: 'Draft' } });
      fireEvent.change(screen.getByPlaceholderText('Project description'), { target: { value: 'Mock draft description' } });
      fireEvent.click(screen.getByRole('button', { name: '$ save' }));
      await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Failed to save project'));
      expect(screen.getByRole('button', { name: 'logout' })).toBeVisible();
      expect(screen.getByPlaceholderText('Project title')).toHaveValue('Draft');
      expect(localStorage.getItem('admin_token')).toBe('isolated-test-token');
    });
  }
});
