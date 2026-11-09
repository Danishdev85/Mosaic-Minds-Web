import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach whichever token exists (admin or therapist) — backend checks role per-route
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------
// Specialties
// -----------------------------
export const getSpecialties = () =>
  api.get('/specialties').then((res) => res.data.specialties);

export const createSpecialty = (payload) =>
  api.post('/specialties', payload).then((res) => res.data);

export const updateSpecialty = (id, payload) =>
  api.put(`/specialties/${id}`, payload).then((res) => res.data);

export const deleteSpecialty = (id) =>
  api.delete(`/specialties/${id}`).then((res) => res.data);

// -----------------------------
// Therapists
// -----------------------------
export const getTherapists = (specialtyId) =>
  api
    .get('/therapists', { params: specialtyId ? { specialty: specialtyId } : {} })
    .then((res) => res.data.therapists);

export const getTherapistById = (id) =>
  api.get(`/therapists/${id}`).then((res) => res.data.therapist);

export const getOwnTherapistProfile = () =>
  api.get('/therapists/me/profile').then((res) => res.data.therapist);

export const createTherapist = (payload) =>
  api.post('/therapists', payload).then((res) => res.data);

export const updateTherapist = (id, payload) =>
  api.put(`/therapists/${id}`, payload).then((res) => res.data);

export const deleteTherapist = (id) =>
  api.delete(`/therapists/${id}`).then((res) => res.data);

// -----------------------------
// Availability
// -----------------------------
export const getTherapistSchedule = (therapistId) =>
  api.get(`/availability/therapist/${therapistId}`).then((res) => res.data.availability);

export const addTherapistSchedule = (therapistId, payload) =>
  api.post(`/availability/therapist/${therapistId}`, payload).then((res) => res.data);

export const updateTherapistSchedule = (id, payload) =>
  api.put(`/availability/${id}`, payload).then((res) => res.data);

export const deleteTherapistSchedule = (id) =>
  api.delete(`/availability/${id}`).then((res) => res.data);

// -----------------------------
// Appointments (guest)
// -----------------------------
export const getAvailableSlots = (therapistId, date) =>
  api
    .get(`/appointments/availability/${therapistId}`, { params: { date } })
    .then((res) => res.data);

export const createAppointment = (payload) =>
  api.post('/appointments', payload).then((res) => res.data.appointment);

export const lookupAppointment = ({ confirmationCode, contact }) =>
  api
    .get('/appointments/lookup', { params: { code: confirmationCode, contact } })
    .then((res) => res.data.appointment);

export const cancelAppointment = ({ confirmationCode, contact }) =>
  api.put('/appointments/cancel', { code: confirmationCode, contact }).then((res) => res.data);

// -----------------------------
// Appointments (admin/therapist)
// -----------------------------
export const getMyAppointments = (params = {}) =>
  api.get('/appointments', { params }).then((res) => res.data.appointments);

export const updateAppointmentStatus = (id, status) =>
  api.put(`/appointments/${id}`, { status }).then((res) => res.data);

// -----------------------------
// Session Notes
// -----------------------------
export const getSessionNotes = (appointmentId) =>
  api.get(`/session-notes/appointment/${appointmentId}`).then((res) => res.data.notes);

export const addSessionNote = (appointmentId, notes) =>
  api.post(`/session-notes/appointment/${appointmentId}`, { notes }).then((res) => res.data);

export const deleteSessionNote = (id) =>
  api.delete(`/session-notes/${id}`).then((res) => res.data);

// -----------------------------
// Auth
// -----------------------------
export const adminLogin = (email, password) =>
  api.post('/auth/admin/login', { email, password }).then((res) => res.data);

export const therapistLogin = (email, password) =>
  api.post('/auth/therapist/login', { email, password }).then((res) => res.data);

// -----------------------------
// Contact
// -----------------------------
export const submitContactMessage = (payload) =>
  api.post('/contact', payload).then((res) => res.data);

export const getContactMessages = (unreadOnly = false) =>
  api
    .get('/contact', { params: unreadOnly ? { unread_only: 'true' } : {} })
    .then((res) => res.data.messages);

export const markMessageRead = (id) =>
  api.put(`/contact/${id}/read`).then((res) => res.data);

export const deleteContactMessage = (id) =>
  api.delete(`/contact/${id}`).then((res) => res.data);

// -----------------------------
// Stats
// -----------------------------
export const getDashboardStats = () =>
  api.get('/stats').then((res) => res.data.stats);

export default api;