import api from './api';


export const browseAdvisors = (params) =>
  api.get('/student/advisors', { params });


export const getAdvisorDetails = (advisorId) =>
  api.get(`/student/advisors/${advisorId}`);


export const getFilteredSlots = (params) =>
  api.get('/student/slots', { params });


export const getStudentDashboard = () =>
  api.get('/dashboard/student');