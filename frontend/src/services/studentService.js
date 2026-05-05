import api from './api';

export const browseAdvisors = (params) =>
  api.get('/student/advisors', { params });

export const getAdvisorDetails = (advisorId) =>
  api.get(`/student/advisors/${advisorId}`);

export const getFilteredSlots = (params) =>
  api.get('/student/slots', { params });

export const getStudentDashboard = () =>
  api.get('/dashboard/student');

export const recommendAdvisors = () =>
  api.get('/student/recommend');

export const searchByExpertise = (params) =>
  api.get('/student/search-expertise', { params });

export const getBookingHistory = () =>
  api.get('/student/booking-history');

export const cancelBooking = (id) =>
  api.delete(`/student/cancel/${id}`);