import api from './api';

// Profile
export const getAdvisorProfile = (userId) => api.get(`/advisor/profile/${userId}`);
export const upsertAdvisorProfile = (data) => api.put('/advisor/profile', data);
export const getAdvisorDashboard = () => api.get('/dashboard/advisor');
export const toggleAcceptingStatus = () => api.patch('/advisor/status');

// Routines
export const getRoutines = () => api.get('/advisor/routines');
export const addRoutine = (data) => api.post('/advisor/routines', data);
export const updateRoutine = (id, data) => api.put(`/advisor/routines/${id}`, data);
export const deleteRoutine = (id) => api.delete(`/advisor/routines/${id}`);