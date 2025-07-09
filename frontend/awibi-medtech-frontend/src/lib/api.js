import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/auth/test-login', credentials),
  register: (userData) => api.post('/api/auth/test-register', userData),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/test-profile'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/api/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  uploadAvatar: (formData) => api.post('/api/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAccount: () => api.delete('/api/users/account'),
  getUsers: (params) => api.get('/api/users', { params }),
  getUserById: (id) => api.get(`/api/users/${id}`),
};

// Chapter API endpoints
export const chapterAPI = {
  getChapters: (params) => api.get('/api/chapters', { params }),
  getChapterById: (id) => api.get(`/api/chapters/${id}`),
  createChapter: (data) => api.post('/api/chapters', data),
  updateChapter: (id, data) => api.put(`/api/chapters/${id}`, data),
  deleteChapter: (id) => api.delete(`/api/chapters/${id}`),
  joinChapter: (id) => api.post(`/api/chapters/${id}/join`),
  leaveChapter: (id) => api.post(`/api/chapters/${id}/leave`),
  getChapterMembers: (id, params) => api.get(`/api/chapters/${id}/members`, { params }),
  getChapterEvents: (id, params) => api.get(`/api/chapters/${id}/events`, { params }),
};

// Event API endpoints
export const eventAPI = {
  getEvents: (params) => api.get('/api/events', { params }),
  getEventById: (id) => api.get(`/api/events/${id}`),
  createEvent: (data) => api.post('/api/events', data),
  updateEvent: (id, data) => api.put(`/api/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/api/events/${id}`),
  registerForEvent: (id) => api.post(`/api/events/${id}/register`),
  unregisterFromEvent: (id) => api.post(`/api/events/${id}/unregister`),
  getEventAttendees: (id, params) => api.get(`/api/events/${id}/attendees`, { params }),
};

// Badge API endpoints
export const badgeAPI = {
  getBadges: (params) => api.get('/api/badges', { params }),
  getBadgeById: (id) => api.get(`/api/badges/${id}`),
  createBadge: (data) => api.post('/api/badges', data),
  updateBadge: (id, data) => api.put(`/api/badges/${id}`, data),
  deleteBadge: (id) => api.delete(`/api/badges/${id}`),
  awardBadge: (userId, badgeId) => api.post('/api/badges/award', { userId, badgeId }),
  getUserBadges: (userId) => api.get(`/api/badges/user/${userId}`),
};

// Dashboard API endpoints
export const dashboardAPI = {
  getOverview: () => api.get('/api/dashboard/test-overview'),
  getMemberStats: () => api.get('/api/dashboard/member-stats'),
  getLeaderStats: () => api.get('/api/dashboard/leader-stats'),
  getAdminStats: () => api.get('/api/dashboard/admin-stats'),
  getSuperAdminStats: () => api.get('/api/dashboard/super-admin-stats'),
  getNotifications: (params) => api.get('/api/dashboard/notifications', { params }),
  markNotificationRead: (id) => api.put(`/api/dashboard/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/api/dashboard/notifications/read-all'),
};

// Search API endpoints
export const searchAPI = {
  searchAll: (query, params) => api.get('/api/search', { params: { q: query, ...params } }),
  searchUsers: (query, params) => api.get('/api/search/users', { params: { q: query, ...params } }),
  searchChapters: (query, params) => api.get('/api/search/chapters', { params: { q: query, ...params } }),
  searchEvents: (query, params) => api.get('/api/search/events', { params: { q: query, ...params } }),
  searchBadges: (query, params) => api.get('/api/search/badges', { params: { q: query, ...params } }),
};

// Analytics API endpoints
export const analyticsAPI = {
  getMetrics: (params) => api.get('/api/analytics/metrics', { params }),
  getUserActivity: (userId, params) => api.get(`/api/analytics/users/${userId}/activity`, { params }),
  getChapterAnalytics: (chapterId, params) => api.get(`/api/analytics/chapters/${chapterId}`, { params }),
  getEventAnalytics: (eventId, params) => api.get(`/api/analytics/events/${eventId}`, { params }),
  getSystemHealth: () => api.get('/api/analytics/health'),
};

// File upload API endpoints
export const uploadAPI = {
  uploadImage: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    return api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadDocument: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    return api.post('/api/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteFile: (fileId) => api.delete(`/api/upload/files/${fileId}`),
};

// Export the main api instance for custom requests
export default api;

