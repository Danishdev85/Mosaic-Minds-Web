import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSignOutAlt, FaCalendarCheck, FaClock, FaVideo, FaUser,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaStickyNote,
  FaLeaf, FaFilter,
} from 'react-icons/fa';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ScheduleManager from '../components/ScheduleManager.jsx';
import {
  getMyAppointments, updateAppointmentStatus,
  getSessionNotes, addSessionNote,
} from '../api/api.js';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber/15' },
  confirmed: { label: 'Confirmed', color: 'text-rust', bg: 'bg-rust/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-50' },
  completed: { label: 'Completed', color: 'text-umber/55', bg: 'bg-umber/10' },
};

function getSessionWindow(appointment) {
  const start = new Date(`${appointment.appointment_date}T${appointment.time_slot}`);
  const joinOpensAt = new Date(start.getTime() - 10 * 60 * 1000);
  const joinClosesAt = new Date(start.getTime() + 60 * 60 * 1000);
  const now = new Date();
  return now >= joinOpensAt && now <= joinClosesAt;
}

export default function TherapistDashboard() {
  const navigate = useNavigate();
  const therapistName = localStorage.getItem('mm_name') || 'Therapist';
  const therapistId = localStorage.getItem('mm_therapist_id');

  const [activeView, setActiveView] = useState('appointments'); // 'appointments' | 'schedule'

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const [notesModal, setNotesModal] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadAppointments = useCallback(() => {
    setLoading(true);
    getMyAppointments(statusFilter ? { status: statusFilter } : {})
      .then(setAppointments)
      .catch((err) => {
        if (err.response?.status === 401) navigate('/therapist/login');
      })
      .finally(() => setLoading(false));
  }, [statusFilter, navigate]);

  useEffect(() => {
    if (!localStorage.getItem('mm_token') || localStorage.getItem('mm_role') !== 'therapist') {
      navigate('/therapist/login');
      return;
    }
    loadAppointments();
  }, [loadAppointments, navigate]);

  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_role');
    localStorage.removeItem('mm_name');
    localStorage.removeItem('mm_therapist_id');
    navigate('/therapist/login');
  }

  function openNotesModal(appointment) {
    setNotesModal(appointment);
    setLoadingNotes(true);
    getSessionNotes(appointment.id)
      .then(setNotes)
      .catch(() => setNotes([]))
      .finally(() => setLoadingNotes(false));
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      await addSessionNote(notesModal.id, newNote.trim());
      setNewNote('');
      const updated = await getSessionNotes(notesModal.id);
      setNotes(updated);
    } catch (err) {
      alert('Failed to save note.');
    } finally {
      setSavingNote(false);
    }
  }

  const filterOptions = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="min-h-[80vh] bg-amber/[0.03]">
      {/* Top bar */}
      <div className="bg-white border-b border-umber/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-rust/10 text-rust flex items-center justify-center text-lg">
              <FaLeaf />
            </span>
            <div>
              <p className="font-display font-semibold text-umber leading-tight">Mosaic Minds</p>
              <p className="text-xs text-umber/50">Welcome, {therapistName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-umber/55 hover:text-red-500 transition-colors">
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* View switcher */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveView('appointments')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeView === 'appointments' ? 'bg-rust text-white shadow-warm-sm' : 'bg-white text-umber/60 border border-umber/15'
            }`}
          >
            My Sessions
          </button>
          <button
            onClick={() => setActiveView('schedule')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeView === 'schedule' ? 'bg-rust text-white shadow-warm-sm' : 'bg-white text-umber/60 border border-umber/15'
            }`}
          >
            My Schedule
          </button>
        </div>

        {/* ---------------- SCHEDULE VIEW ---------------- */}
        {activeView === 'schedule' && (
          therapistId ? (
            <ScheduleManager therapistId={therapistId} />
          ) : (
            <div className="text-center py-20 warm-card">
              <p className="text-umber/45 font-medium">
                Couldn't determine your therapist ID. Please log out and log in again.
              </p>
            </div>
          )
        )}

        {/* ---------------- APPOINTMENTS VIEW ---------------- */}
        {activeView === 'appointments' && (
          <>
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <FaFilter className="text-umber/35 text-sm" />
              {filterOptions.map((opt) => (
                <button
                  key={opt || 'all'}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    statusFilter === opt ? 'bg-umber text-white' : 'bg-white text-umber/55 border border-umber/15 hover:border-rust/30'
                  }`}
                >
                  {opt || 'All'}
                </button>
              ))}
            </div>

            {loading ? (
              <LoadingSpinner fullPage />
            ) : appointments.length === 0 ? (
              <div className="text-center py-20 warm-card">
                <p className="text-umber/45 font-medium">No sessions found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {appointments.map((appt) => {
                    const cfg = statusConfig[appt.status];
                    const canJoin = (appt.status === 'pending' || appt.status === 'confirmed') && getSessionWindow(appt);

                    return (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="warm-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-rust/10 text-rust flex items-center justify-center shrink-0">
                            <FaUser />
                          </div>
                          <div>
                            <p className="font-medium text-umber">{appt.client_name}</p>
                            <p className="text-xs text-umber/45">{appt.client_phone} · {appt.client_email}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-umber/50">
                              <span className="flex items-center gap-1"><FaCalendarCheck className="text-[10px]" /> {new Date(appt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              <span className="flex items-center gap-1"><FaClock className="text-[10px]" /> {appt.time_slot?.slice(0, 5)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>

                          {canJoin && appt.video_room_name && (
                            <button
                              onClick={() => navigate(`/session/${appt.video_room_name}`, { state: { roomUrl: appt.video_room_url, appointment: appt } })}
                              className="flex items-center gap-1.5 bg-rust text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-warm-sm"
                            >
                              <FaVideo className="text-[10px]" /> Join
                            </button>
                          )}

                          <button
                            onClick={() => openNotesModal(appt)}
                            className="flex items-center gap-1.5 text-xs font-medium text-umber/55 hover:text-rust px-3.5 py-2 rounded-lg border border-umber/15 hover:border-rust/30 transition-colors"
                          >
                            <FaStickyNote className="text-[10px]" /> Notes
                          </button>

                          {appt.status === 'pending' && (
                            <button
                              disabled={updatingId === appt.id}
                              onClick={() => handleStatusChange(appt.id, 'confirmed')}
                              className="w-8 h-8 rounded-lg bg-rust/10 text-rust flex items-center justify-center hover:bg-rust/20 transition-colors disabled:opacity-50"
                              title="Confirm"
                            >
                              <FaCheckCircle className="text-xs" />
                            </button>
                          )}
                          {appt.status === 'confirmed' && (
                            <button
                              disabled={updatingId === appt.id}
                              onClick={() => handleStatusChange(appt.id, 'completed')}
                              className="w-8 h-8 rounded-lg bg-umber/10 text-umber flex items-center justify-center hover:bg-umber/20 transition-colors disabled:opacity-50"
                              title="Mark completed"
                            >
                              <FaHourglassHalf className="text-xs" />
                            </button>
                          )}
                          {(appt.status === 'pending' || appt.status === 'confirmed') && (
                            <button
                              disabled={updatingId === appt.id}
                              onClick={() => handleStatusChange(appt.id, 'cancelled')}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
                              title="Cancel"
                            >
                              <FaTimesCircle className="text-xs" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      {/* Session Notes Modal */}
      <AnimatePresence>
        {notesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-umber/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setNotesModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-7 w-full max-w-lg max-h-[80vh] overflow-y-auto text-umber"
            >
              <h3 className="font-display text-lg font-semibold text-umber mb-1">Session Notes</h3>
              <p className="text-xs text-umber/45 mb-5">{notesModal.client_name} · {new Date(notesModal.appointment_date).toLocaleDateString()}</p>

              {loadingNotes ? (
                <LoadingSpinner label="Loading notes..." />
              ) : (
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-sm text-umber/40 italic">No notes yet for this session.</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="bg-amber/[0.06] rounded-xl p-4">
                        <p className="text-sm text-umber/75 leading-relaxed">{note.notes}</p>
                        <p className="text-xs text-umber/35 mt-2">
                          {new Date(note.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a private note about this session..."
                  className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors resize-none"
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setNotesModal(null)} className="px-5 py-2.5 rounded-full text-sm font-medium text-umber/55 hover:text-umber transition-colors">
                    Close
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={savingNote || !newNote.trim()}
                    className="bg-rust text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-warm-sm disabled:opacity-50"
                  >
                    {savingNote ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}