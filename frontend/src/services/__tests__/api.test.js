import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getProjects,
  submitContact,
  loginAdmin,
  deleteProject,
} from '../api';

describe('API Service (native fetch wrapper)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('performs GET request and attaches JSON response data', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ projects: [{ id: 1, title: 'PrintAPM' }] }),
    });

    const res = await getProjects();
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ projects: [{ id: 1, title: 'PrintAPM' }] });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/projects'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('performs POST request with stringified body', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true }),
    });

    const payload = { name: 'Ankit', email: 'a@example.com', message: 'Hello!' };
    const res = await submitContact(payload);
    expect(res.status).toBe(201);
    expect(res.data).toEqual({ success: true });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/contact'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  });

  it('includes Authorization header when admin_token is present in localStorage', async () => {
    localStorage.setItem('admin_token', 'mock-jwt-token-xyz');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ token: 'mock-jwt-token-xyz' }),
    });

    await loginAdmin({ email: 'admin@test.com', password: 'secret' });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-jwt-token-xyz',
        }),
      })
    );
  });

  it('throws an error with response object on non-2xx status', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'Rate limit exceeded' }),
    });

    await expect(submitContact({ name: 'Spam', email: 's@spam.com', message: 'Test' })).rejects.toMatchObject({
      message: expect.stringContaining('429'),
      response: {
        status: 429,
        data: { error: 'Rate limit exceeded' },
      },
    });
  });

  it('handles DELETE method properly', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ deleted: true }),
    });

    const res = await deleteProject('proj-123');
    expect(res.status).toBe(200);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/projects/proj-123'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
