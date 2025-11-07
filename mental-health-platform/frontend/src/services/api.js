import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Mood APIs
export const moodAPI = {
  createEntry: (data) => api.post('/mood', data),
  getEntries: () => api.get('/mood'),
  getEntriesByRange: (startDate, endDate) => 
    api.get(`/mood/range?startDate=${startDate}&endDate=${endDate}`),
  getAnalytics: (days = 30) => api.get(`/mood/analytics?days=${days}`),
  deleteEntry: (id) => api.delete(`/mood/${id}`),
};

// Exercise APIs
export const exerciseAPI = {
  getAll: () => api.get('/exercises'),
  getByType: (type) => api.get(`/exercises/type/${type}`),
  getById: (id) => api.get(`/exercises/${id}`),
  startExercise: (exerciseId) => api.post(`/exercises/${exerciseId}/start`),
  completeExercise: (progressId, rating, feedback) => 
    api.post(`/exercises/progress/${progressId}/complete`, null, {
      params: { rating, feedback }
    }),
  getProgress: () => api.get('/exercises/progress'),
  getStats: () => api.get('/exercises/stats'),
};

// Chat APIs
export const chatAPI = {
  createSession: () => api.post('/chat/session'),
  getSession: (sessionId) => api.get(`/chat/session/${sessionId}`),
  getSessions: () => api.get('/chat/sessions'),
  endSession: (sessionId, rating, feedback) => 
    api.post(`/chat/session/${sessionId}/end`, null, {
      params: { rating, feedback }
    }),
};

export default api;
