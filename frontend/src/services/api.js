import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// Add Bearer token to all requests for existing services
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('thesease-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

export default api;