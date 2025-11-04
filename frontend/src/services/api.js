import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
// Base API URL
const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token
// Request interceptor to add JWT token
api.interceptors.request.use(
    async (config) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.log('No active session');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Session expired, please login again');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  createProfile: (data) => api.post('/auth/profile', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Clubs API
export const clubsAPI = {
  getAll: () => api.get('/clubs'),
  getById: (clubId) => api.get(`/clubs/${clubId}`),
  create: (data) => api.post('/clubs', data),
  update: (clubId, data) => api.put(`/clubs/${clubId}`, data),
  delete: (clubId) => api.delete(`/clubs/${clubId}`),
  join: (clubId) => api.post(`/clubs/${clubId}/join`)
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (eventId) => api.get(`/events/${eventId}`),
  getByClub: (clubId) => api.get(`/events/club/${clubId}`),
  create: (data) => api.post('/events', data),
  update: (eventId, data) => api.put(`/events/${eventId}`, data),
  delete: (eventId) => api.delete(`/events/${eventId}`),
  register: (eventId) => api.post(`/events/${eventId}/register`)
};

export default api;
