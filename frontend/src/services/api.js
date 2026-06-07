import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
