import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const normalizeProject = (project) => ({
  ...project,
  _id: project._id ?? project.id,
  techStack: project.techStack ?? project.tech_stack ?? [],
  githubUrl: project.githubUrl ?? project.github_url ?? '',
  liveUrl: project.liveUrl ?? project.live_url ?? '',
});

const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      const data = res.data?.data || res.data?.projects || res.data;
      if (Array.isArray(data)) setProjects(data.map(normalizeProject));
    } catch {
      setProjects([]);
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
      .catch(() => {
        if (!ignore) setProjects([]);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

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
    localStorage.removeItem('admin_token');
    setToken(null);
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
    } catch {
      alert('Failed to save project');
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
    } catch {
      alert('Failed to delete');
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4">
        <motion.form
          onSubmit={handleLogin}
          className="glass w-full max-w-md rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lock className="mx-auto mb-4 text-[#00d4ff]" size={32} />
          <h1 className="text-center text-2xl font-bold neon-text">Admin Login</h1>
          {loginError && (
            <p className="mt-4 text-center text-sm text-red-400">{loginError}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            required
            value={loginForm.email}
            onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-6 w-full rounded-xl bg-white/5 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#00d4ff]"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={loginForm.password}
            onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
            className="mt-4 w-full rounded-xl bg-white/5 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#00d4ff]"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#a855f7] py-3 font-semibold text-black disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-4 md:p-8">
      <motion.div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold neon-text">Project Admin</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm text-zinc-400 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="glass mb-8 rounded-2xl p-6 space-y-4"
        >
          <h2 className="flex items-center gap-2 font-semibold text-white">
            {editingId ? <Pencil size={18} /> : <Plus size={18} />}
            {editingId ? 'Edit Project' : 'Add Project'}
          </h2>
          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-white outline-none"
          />
          <textarea
            placeholder="Description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full resize-none rounded-xl bg-white/5 px-4 py-2 text-white outline-none"
          />
          <input
            placeholder="Tech stack (comma separated)"
            value={form.techStack}
            onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-white outline-none"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
              className="rounded-xl bg-white/5 px-4 py-2 text-white outline-none"
            />
            <input
              placeholder="Live URL"
              value={form.liveUrl}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
              className="rounded-xl bg-white/5 px-4 py-2 text-white outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Featured project
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#00d4ff] px-6 py-2 font-semibold text-black disabled:opacity-60"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_PROJECT);
                }}
                className="rounded-xl glass px-6 py-2 text-sm text-zinc-400"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        <motion.div className="space-y-4">
          {projects.map((project) => (
            <motion.div
              key={project._id}
              className="glass flex items-center justify-between rounded-xl p-4"
            >
              <div>
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-zinc-500 line-clamp-1">
                  {project.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="rounded-lg p-2 text-zinc-400 hover:text-[#00d4ff]"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project._id)}
                  className="rounded-lg p-2 text-zinc-400 hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <p className="text-center text-zinc-500">No projects yet.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Admin;
