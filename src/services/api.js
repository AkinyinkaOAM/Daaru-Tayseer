import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

/* ─── Auth ─── */
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

/* ─── Students ─── */
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id, password) => api.delete(`/students/${id}`, { data: { password } }),
};

/* ─── Scores ─── */
export const scoresAPI = {
  upload: (data) => (data?.scores ? api.post('/scores/bulk', data) : api.post('/scores', data)),
  getByStudent: (studentId, term, session) =>
    api.get(`/scores/student/${studentId}`, { params: { term, session } }),
  getPortalSummary: () => api.get('/scores/portal/me'),
};

/* ─── Portal ─── */
export const portalAPI = {
  getStudentSummary: () => api.get('/portal/student/me'),
  updateStudentProfile: (data) => api.put('/portal/student/profile', data),
  uploadStudentProfileImage: (formData) => api.post('/portal/student/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getParentSummary: () => api.get('/portal/parent/me'),
};

/* ─── Academic Records ─── */
export const academicRecordsAPI = {
  getAll: (params) => api.get('/academic-records', { params }),
  create: (data) => api.post('/academic-records', data),
  delete: (id) => api.delete(`/academic-records/${id}`),
};

/* ─── Payments ─── */
export const paymentsAPI = {
  getAll: (params) => api.get('/payments', { params }),
  create: (data) => api.post('/payments', data),
  getReceipt: (id) => api.get(`/payments/${id}/receipt?format=pdf`, { responseType: 'blob' }),
};

/* ─── Reports ─── */
export const reportsAPI = {
  getBroadsheet: (params) => api.get('/reports/broadsheet', { params }),
  exportBroadsheetCsv: (params) => api.get('/reports/broadsheet/csv', { params, responseType: 'blob' }),
  exportPaymentsCsv: (params) => api.get('/reports/payments/csv', { params, responseType: 'blob' }),
};

/* ─── Audit Logs ─── */
export const auditLogsAPI = {
  getAll: (params) => api.get('/audit-logs', { params }),
};

/* ─── Gallery ─── */
export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  upload: (data) => api.post('/gallery', data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

/* ─── Contact ─── */
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  resolve: (id) => api.put(`/contact/${id}/resolve`),
};

/* ─── Admissions ─── */
export const admissionsAPI = {
  apply: (data) => api.post('/admissions', data),
  getAll: (params) => api.get('/admissions', { params }),
  updateStatus: (id, status) => api.put(`/admissions/${id}/status`, { status }),
  delete: (id) => api.delete(`/admissions/${id}`),
};

/* ─── News & Events ─── */
export const newsEventsAPI = {
  getPublic: (params) => api.get('/news-events', { params }),
  getAdmin: (params) => api.get('/news-events/admin', { params }),
  create: (data) => api.post('/news-events', data),
  update: (id, data) => api.put(`/news-events/${id}`, data),
  delete: (id) => api.delete(`/news-events/${id}`),
};

/* ─── Downloads ─── */
export const downloadsAPI = {
  getPublic: (params) => api.get('/downloads', { params }),
  getAdmin: (params) => api.get('/downloads/admin', { params }),
  create: (data) => api.post('/downloads', data),
  upload: (formData) => api.post('/downloads/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/downloads/${id}`, data),
  delete: (id) => api.delete(`/downloads/${id}`),
};

/* ─── Admin ─── */
export const adminAPI = {
  getAll: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  resendInvitation: (id) => api.post(`/users/${id}/resend-invitation`),
  update: (id, data) => api.put(`/users/${id}`, data),
  updateRole: (id, role) => api.put(`/users/${id}`, { role }),
  delete: (id, password) => api.delete(`/users/${id}`, { data: { password } }),
};

