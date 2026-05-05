import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('thesease-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('thesease-token');
      localStorage.removeItem('thesease-user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (data) => (await authApi.post('/auth/register', data)).data;
export const loginUser = async (data) => (await authApi.post('/auth/login', data)).data;
export const verifyOTP = async (data) => (await authApi.post('/auth/verify-email', data)).data;
export const resendOTP = async (email) => (await authApi.post('/auth/resend-otp', { email })).data;
export const getProfile = async () => (await authApi.get('/auth/me')).data;
export const logoutUser = async () => (await authApi.post('/auth/logout')).data;

export default authApi;
