import { useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import { Lock, Plus, Trash2, Pencil, LogOut } from 'lucide-react';
import {
  loginAdmin,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/api';

const EMPTY_PROJECT = {
  title: '',
  description: '',
  techStack: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
};

const SESSION_EXPIRED_MESSAGE = 'Your session has expired or is invalid. Please sign in again.';

const normalizeProject = (project) => ({
  ...project,
  _id: project._id ?? project.id,
  techStack: project.techStack ?? project.tech_stack ?? [],
  githubUrl: project.githubUrl ?? project.github_url ?? '',
  liveUrl: project.liveUrl ?? project.live_url ?? '',
});

import { usePageMeta } from '../hooks/usePageMeta';

const Admin = () => {
  usePageMeta({
    title: 'Admin Dashboard | Ankit Singh',
    noindex: true,
  });

  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearSession = useCallback((message = '') => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setProjects([]);
    setForm(EMPTY_PROJECT);
    setEditingId(null);
    setLoginForm({ email: '', password: '' });
    setLoginError(message);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      const data = res.data?.data || res.data?.projects || res.data;
      if (Array.isArray(data)) setProjects(data.map(normalizeProject));
    } catch (error) {
      if (error?.response?.status === 401) clearSession(SESSION_EXPIRED_MESSAGE);
      else setProjects([]);
    }
  };

  useEffect(() => {
    if (!token) return;

    let ignore = false;
    getProjects()
      .then((res) => {
        if (ignore) return;
        const data = res.data?.data || res.data?.projects || res.data;
        if (Array.isArray(data)) setProjects(data.map(normalizeProject));
      })
      .catch((error) => {
        if (ignore) return;
        if (error?.response?.status === 401) clearSession(SESSION_EXPIRED_MESSAGE);
        else setProjects([]);
      });

    return () => {
      ignore = true;
    };
  }, [token, clearSession]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await loginAdmin(loginForm);
      const t = res.data?.token;
      if (t) {
        localStorage.setItem('admin_token', t);
        setToken(t);
      }
    } catch {
      setLoginError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: form.title,
      description: form.description,
      tech_stack: form.techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      github_url: form.githubUrl || null,
      live_url: form.liveUrl || null,
      featured: form.featured,
    };
    try {
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }
      setForm(EMPTY_PROJECT);
      setEditingId(null);
      await fetchProjects();
    } catch (error) {
      if (error?.response?.status === 401) clearSession(SESSION_EXPIRED_MESSAGE);
      else alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title || '',
      description: project.description || '',
      techStack: (project.techStack || []).join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured || false,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      await fetchProjects();
    } catch (error) {
      if (error?.response?.status === 401) clearSession(SESSION_EXPIRED_MESSAGE);
      else alert('Failed to delete');
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#16140F] p-4 font-sans text-[#F1E9D2]">
        <m.form
          onSubmit={handleLogin}
          className="w-full max-w-md border border-[#2E2A21] bg-[#1E1B15] p-8 rounded-[2px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="text-[#E8A33D]" size={20} />
            <h1 className="font-mono text-xl font-semibold text-[#F1E9D2]">
              $ auth login
            </h1>
          </div>

          {loginError && (
            <p role="alert" className="mt-2 text-center text-xs font-mono text-[#D9644A] border border-[#D9644A]/30 bg-[#D9644A]/10 p-2 rounded-[2px]">
              {loginError}
            </p>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-mono text-[#B9B09A] mb-1">
                user.email
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-[2px] border border-[#2E2A21] bg-[#16140F] px-3 py-2 text-sm text-[#F1E9D2] font-mono focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-mono text-[#B9B09A] mb-1">
                user.password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full rounded-[2px] border border-[#2E2A21] bg-[#16140F] px-3 py-2 text-sm text-[#F1E9D2] font-mono focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-[2px] bg-[#E8A33D] py-2.5 font-mono text-sm font-medium text-[#16140F] hover:bg-[#d49332] transition-colors disabled:opacity-50"
            >
              {loading ? '$ verifying...' : '$ authenticate'}
            </button>
          </div>
        </m.form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#16140F] p-4 md:p-8 font-sans text-[#F1E9D2]">
      <m.div
        className="mx-auto max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <header className="mb-8 flex items-center justify-between border-b border-[#2E2A21] pb-4">
          <h1 className="font-mono text-xl font-bold text-[#F1E9D2]">
            <span className="text-[#E8A33D] mr-2">$</span>
            manage projects
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 border border-[#2E2A21] bg-[#1E1B15] px-3 py-1.5 font-mono text-xs text-[#B9B09A] hover:text-[#E8A33D] rounded-[2px] transition-colors"
          >
            <LogOut size={14} />
            logout
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mb-8 border border-[#2E2A21] bg-[#1E1B15] p-6 space-y-4 rounded-[2px]"
        >
          <h2 className="flex items-center gap-2 font-mono text-base font-semibold text-[#F1E9D2]">
            {editingId ? <Pencil size={16} className="text-[#E8A33D]" /> : <Plus size={16} className="text-[#E8A33D]" />}
            {editingId ? '$ edit --target ' + editingId : '$ create --new project'}
          </h2>

          <div>
            <label className="block text-xs font-mono text-[#B9B09A] mb-1">Title</label>
            <input
              placeholder="Project title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-[2px] border border-[#2E2A21] bg-[#16140F] px-3 py-2 text-sm text-[#F1E9D2] font-mono focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#B9B09A] mb-1">Description</label>
            <textarea
              placeholder="Project description"
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full resize-none rounded-[2px] border border-[#2E2A21] bg-[#16140F] px-3 py-2 text-sm text-[#F1E9D2] font-mono focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#B9B09A] mb-1">Tech Stack (comma separated)</label>
            <input
              placeholder="React, Node.js, MySQL"
              value={form.techStack}
              onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
              className="w-full rounded-[2px] border border-[#2E2A21] bg-[#16140F] px-3 py-2 text-sm text-[#F1E9D2] font-mono focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono text-[#B9B09A] mb-1">GitHub URL</label>
              <input
                placeholder="https://github.com/..."
                value={form.githubUrl}
                onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                className="w-full rounded-[2px] border border-[#2E2A21] bg-[#16140F] px-3 py-2 text-sm text-[#F1E9D2] font-mono focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#B9B09A] mb-1">Live URL</label>
              <input
                placeholder="https://..."
                value={form.liveUrl}
                onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                className="w-full rounded-[2px] border border-[#2E2A21] bg-[#16140F] px-3 py-2 text-sm text-[#F1E9D2] font-mono focus-visible:outline-2 focus-visible:outline-[#E8A33D]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 font-mono text-xs text-[#B9B09A] cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="accent-[#E8A33D]"
            />
            featured: true
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-[2px] bg-[#E8A33D] px-5 py-2 font-mono text-xs font-medium text-[#16140F] hover:bg-[#d49332] transition-colors disabled:opacity-60"
            >
              {editingId ? '$ update' : '$ save'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_PROJECT);
                }}
                className="rounded-[2px] border border-[#2E2A21] bg-[#16140F] px-4 py-2 font-mono text-xs text-[#B9B09A] hover:text-[#F1E9D2]"
              >
                cancel
              </button>
            )}
          </div>
        </form>

        <section className="space-y-3">
          <h2 className="font-mono text-sm text-[#B9B09A] mb-2">$ ls projects/</h2>
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between border border-[#2E2A21] bg-[#1E1B15] p-4 rounded-[2px]"
            >
              <div>
                <h3 className="font-mono text-sm font-semibold text-[#F1E9D2]">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-[#B9B09A] line-clamp-1 max-w-lg">
                  {project.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="border border-[#2E2A21] p-1.5 text-[#B9B09A] hover:text-[#E8A33D] rounded-[2px]"
                  aria-label={`Edit ${project.title}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project._id)}
                  className="border border-[#2E2A21] p-1.5 text-[#B9B09A] hover:text-[#D9644A] rounded-[2px]"
                  aria-label={`Delete ${project.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="border border-dashed border-[#2E2A21] p-6 text-center font-mono text-xs text-[#B9B09A]">
              No projects recorded in database.
            </p>
          )}
        </section>
      </m.div>
    </main>
  );
};

export default Admin;
