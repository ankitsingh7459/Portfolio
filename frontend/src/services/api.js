const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Lightweight native fetch wrapper replacing axios.
 * Provides baseURL, authorization headers, 15s timeout, and error response shapes.
 */
const request = async (endpoint, options = {}) => {
  const base = API_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${base}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutMs = options.timeout ?? 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers?.get?.('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`);
      error.response = {
        status: response.status,
        data,
        headers: response.headers,
      };
      throw error;
    }

    return { data, status: response.status, headers: response.headers };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

const api = {
  get: (url, config) => request(url, { ...config, method: 'GET' }),
  post: (url, body, config) => request(url, { ...config, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, config) => request(url, { ...config, method: 'PUT', body: JSON.stringify(body) }),
  delete: (url, config) => request(url, { ...config, method: 'DELETE' }),
};

export const getProfile = () => api.get('/profile');
export const getSkills = () => api.get('/skills');
export const getProjects = () => api.get('/projects');
export const getCertifications = () => api.get('/certifications');
export const submitContact = (data) => api.post('/contact', data);
export const trackVisit = (data) => api.post('/analytics/track', data);
export const getAnalytics = () => api.get('/analytics/stats');
export const getGitHubActivity = () => api.get('/analytics/github');
export const loginAdmin = (data) => api.post('/auth/login', data);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const createCertification = (data) => api.post('/certifications', data);

export default api;
