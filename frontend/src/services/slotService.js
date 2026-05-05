import api from './api';

// Advisor
export const createSlot = (data) => api.post('/slots', data);
export const getAdvisorSlots = () => api.get('/slots/my-slots');
export const updateSlot = (id, data) => api.put(`/slots/${id}`, data);
export const deleteSlot = (id) => api.delete(`/slots/${id}`);

// Student
export const bookSlot = (slotId) => api.post(`/slots/${slotId}/book`);
export const cancelBooking = (bookingId) => api.patch(`/slots/cancel/${bookingId}`);

// Reviews
export const submitReview = (bookingId, data) => api.post(`/reviews/${bookingId}`, data);
export const getAdvisorReviews = (advisorId) => api.get(`/reviews/advisor/${advisorId}`);