import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSignOutAlt, FaCalendarCheck, FaUserMd, FaCheck, FaTimes, FaHourglassHalf,
  FaCheckDouble, FaFilter, FaLeaf, FaPlus, FaEdit, FaTrash, FaEnvelope,
  FaEnvelopeOpenText, FaUser, FaChartBar, FaLayerGroup,
} from 'react-icons/fa';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
  getMyAppointments, updateAppointmentStatus,
  getTherapists, createTherapist, updateTherapist, deleteTherapist,
  getSpecialties, createSpecialty, deleteSpecialty,
  getContactMessages, markMessageRead, deleteContactMessage,
  getDashboardStats,
} from '../api/api.js';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber/15' },
  confirmed: { label: 'Confirmed', color: 'text-rust', bg: 'bg-rust/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-50' },
  completed: { label: 'Completed', color: 'text-umber/55', bg: 'bg-umber/10' },
};

const emptyTherapistForm = {
  specialty_id: '', name: '', email: '', password: '', title: '',
  bio: '', years_experience: '', session_fee: '',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('mm_name') || 'Admin';

  const [tab, setTab] = useState('overview');

  // Overview
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Appointments
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Therapists
  const [therapists, setTherapists] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loadingTherapists, setLoadingTherapists] = useState(true);
  const [showTherapistForm, setShowTherapistForm] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [therapistForm, setTherapistForm] = useState(emptyTherapistForm);
  const [savingTherapist, setSavingTherapist] = useState(false);

  // Messages
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const loadStats = useCallback(() => {
    setLoadingStats(true);
    getDashboardStats().then(setStats).catch(() => {}).finally(() => setLoadingStats(false));
  }, []);

  const loadAppointments = useCallback(() => {
    setLoadingAppts(true);
    getMyAppointments(statusFilter ? { status: statusFilter } : {})
      .then(setAppointments)
      .catch((err) => { if (err.response?.status === 401) navigate('/'); })
      .finally(() => setLoadingAppts(false));
  }, [statusFilter, navigate]);

  const loadTherapistsAndSpecialties = useCallback(() => {
    setLoadingTherapists(true);
    Promise.all([getTherapists(), getSpecialties()])
      .then(([t, s]) => { setTherapists(t); setSpecialties(s); })
      .catch(() => {})
      .finally(() => setLoadingTherapists(false));
  }, []);

  const loadMessages = useCallback(() => {
    setLoadingMessages(true);
    getContactMessages(unreadOnly).then(setMessages).catch(() => {}).finally(() => setLoadingMessages(false));
  }, [unreadOnly]);

  useEffect(() => {
    if (!localStorage.getItem('mm_token') || localStorage.getItem('mm_role') !== 'admin') {
      navigate('/');
      return;
    }
    loadStats();
    loadAppointments();
    loadTherapistsAndSpecialties();
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (tab === 'appointments') loadAppointments(); }, [statusFilter]); // eslint-disable-line
  useEffect(() => { if (tab === 'messages') loadMessages(); }, [unreadOnly]); // eslint-disable-line

  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch { alert('Failed to update status.'); }
    finally { setUpdatingId(null); }
  }

  function openNewTherapistForm() {
    setEditingTherapist(null);
    setTherapistForm(emptyTherapistForm);
    setShowTherapistForm(true);
  }

  function openEditTherapistForm(t) {
    setEditingTherapist(t);
    setTherapistForm({
      specialty_id: String(t.specialty_id), name: t.name, email: t.email, password: '',
      title: t.title || '', bio: t.bio || '', years_experience: t.years_experience || '',
      session_fee: t.session_fee || '',
    });
    setShowTherapistForm(true);
  }

  async function handleTherapistSubmit(e) {
    e.preventDefault();
    setSavingTherapist(true);
    try {
      if (editingTherapist) {
        const payload = { ...therapistForm };
        if (!payload.password) delete payload.password;
        await updateTherapist(editingTherapist.id, payload);
      } else {
        await createTherapist(therapistForm);
      }
      setShowTherapistForm(false);
      loadTherapistsAndSpecialties();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save therapist.');
    } finally {
      setSavingTherapist(false);
    }
  }

  async function handleDeleteTherapist(id) {
    if (!confirm('Remove this therapist? This cannot be undone.')) return;
    try {
      await deleteTherapist(id);
      setTherapists((prev) => prev.filter((t) => t.id !== id));
    } catch { alert('Failed to delete therapist.'); }
  }

  async function handleMarkRead(id) {
    try {
      await markMessageRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    } catch { alert('Failed to mark as read.'); }
  }

  async function handleDeleteMessage(id) {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch { alert('Failed to delete message.'); }
  }

  function handleLogout() {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_role');
    localStorage.removeItem('mm_name');
    navigate('/');
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: FaChartBar },
    { key: 'appointments', label: 'Sessions', icon: FaCalendarCheck },
    { key: 'therapists', label: 'Therapists', icon: FaUserMd },
    { key: 'messages', label: 'Messages', icon: FaEnvelope },
  ];

  return (
    <div className="min-h-[80vh] bg-amber/[0.03]">
      <div className="bg-white border-b border-umber/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-rust/10 text-rust flex items-center justify-center text-lg"><FaLeaf /></span>
            <div>
              <p className="font-display font-semibold text-umber leading-tight">Mosaic Minds Admin</p>
              <p className="text-xs text-umber/50">Welcome, {adminName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-umber/55 hover:text-red-500 transition-colors">
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                tab === key ? 'bg-rust text-white shadow-warm-sm' : 'bg-white text-umber/60 border border-umber/15 hover:border-rust/30'
              }`}
            >
              <Icon /> {label}
              {key === 'messages' && messages.some((m) => !m.is_read) && tab !== 'messages' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* ---------------- OVERVIEW ---------------- */}
        {tab === 'overview' && (
          loadingStats ? <LoadingSpinner fullPage /> : stats && (
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                  { label: 'Total Sessions', value: stats.total_appointments },
                  { label: 'Pending', value: stats.pending_count },
                  { label: 'Today', value: stats.today_count },
                  { label: 'Unread Messages', value: stats.unread_messages },
                  { label: 'Therapists', value: stats.total_therapists },
                  { label: 'Specialties', value: stats.total_specialties },
                ].map((s) => (
                  <div key={s.label} className="warm-card p-6 text-center">
                    <p className="font-display text-3xl font-semibold text-rust mb-1">{s.value}</p>
                    <p className="text-xs text-umber/55 uppercase tracking-wide font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="warm-card p-6">
                <h3 className="font-display font-semibold text-umber mb-4 flex items-center gap-2">
                  <FaLayerGroup className="text-rust text-sm" /> Sessions by Specialty
                </h3>
                <div className="space-y-3">
                  {stats.by_specialty.length === 0 ? (
                    <p className="text-sm text-umber/40 italic">No data yet.</p>
                  ) : (
                    stats.by_specialty.map((s) => (
                      <div key={s.specialty} className="flex items-center gap-3">
                        <span className="text-sm text-umber/70 w-40 shrink-0">{s.specialty}</span>
                        <div className="flex-1 h-2 bg-umber/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rust rounded-full"
                            style={{ width: `${(s.count / stats.total_appointments) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-umber w-6 text-right">{s.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )
        )}

        {/* ---------------- APPOINTMENTS ---------------- */}
        {tab === 'appointments' && (
          <div>
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <FaFilter className="text-umber/35 text-sm" />
              {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((opt) => (
                <button
                  key={opt || 'all'}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    statusFilter === opt ? 'bg-umber text-white' : 'bg-white text-umber/55 border border-umber/15'
                  }`}
                >
                  {opt || 'All'}
                </button>
              ))}
            </div>

            {loadingAppts ? <LoadingSpinner fullPage /> : appointments.length === 0 ? (
              <div className="text-center py-20 warm-card"><p className="text-umber/45 font-medium">No sessions found.</p></div>
            ) : (
              <div className="warm-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber/[0.06] text-left text-xs uppercase tracking-wide text-umber/50">
                        <th className="px-5 py-3.5 font-semibold">Client</th>
                        <th className="px-5 py-3.5 font-semibold">Therapist</th>
                        <th className="px-5 py-3.5 font-semibold">Date & Time</th>
                        <th className="px-5 py-3.5 font-semibold">Code</th>
                        <th className="px-5 py-3.5 font-semibold">Status</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {appointments.map((appt) => {
                          const cfg = statusConfig[appt.status];
                          return (
                            <motion.tr key={appt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-umber/10">
                              <td className="px-5 py-4">
                                <p className="font-medium text-umber">{appt.client_name}</p>
                                <p className="text-xs text-umber/45">{appt.client_phone}</p>
                              </td>
                              <td className="px-5 py-4 text-umber/70">{appt.therapist_name}</td>
                              <td className="px-5 py-4 text-umber/70">
                                {new Date(appt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {appt.time_slot?.slice(0, 5)}
                              </td>
                              <td className="px-5 py-4 font-mono text-xs text-umber/55">{appt.confirmation_code}</td>
                              <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span></td>
                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-1.5">
                                  {appt.status === 'pending' && (
                                    <button disabled={updatingId === appt.id} onClick={() => handleStatusChange(appt.id, 'confirmed')} className="w-8 h-8 rounded-lg bg-rust/10 text-rust flex items-center justify-center hover:bg-rust/20 disabled:opacity-50"><FaCheck className="text-xs" /></button>
                                  )}
                                  {appt.status === 'confirmed' && (
                                    <button disabled={updatingId === appt.id} onClick={() => handleStatusChange(appt.id, 'completed')} className="w-8 h-8 rounded-lg bg-umber/10 text-umber flex items-center justify-center hover:bg-umber/20 disabled:opacity-50"><FaCheckDouble className="text-xs" /></button>
                                  )}
                                  {(appt.status === 'pending' || appt.status === 'confirmed') && (
                                    <button disabled={updatingId === appt.id} onClick={() => handleStatusChange(appt.id, 'cancelled')} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 disabled:opacity-50"><FaTimes className="text-xs" /></button>
                                  )}
                                  {updatingId === appt.id && <span className="w-8 h-8 flex items-center justify-center"><FaHourglassHalf className="text-xs text-umber/30 animate-pulse" /></span>}
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- THERAPISTS ---------------- */}
        {tab === 'therapists' && (
          <div>
            <div className="flex justify-end mb-6">
              <button onClick={openNewTherapistForm} className="flex items-center gap-2 bg-rust text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-warm-sm">
                <FaPlus className="text-xs" /> Add Therapist
              </button>
            </div>

            {loadingTherapists ? <LoadingSpinner fullPage /> : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {therapists.map((t) => (
                  <div key={t.id} className="warm-card p-5">
                    <p className="font-display font-semibold text-umber">{t.name}</p>
                    <p className="text-sm text-rust font-medium mb-1">{t.title}</p>
                    <p className="text-xs text-umber/45 mb-4">{t.specialty_name} · Rs. {Number(t.session_fee).toLocaleString()}/session</p>
                    <div className="flex gap-2">
                      <button onClick={() => openEditTherapistForm(t)} className="flex items-center gap-1.5 text-xs font-medium text-umber/60 hover:text-rust px-3 py-1.5 rounded-lg border border-umber/15"><FaEdit className="text-[10px]" /> Edit</button>
                      <button onClick={() => handleDeleteTherapist(t.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg border border-red-100"><FaTrash className="text-[10px]" /> Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- MESSAGES ---------------- */}
        {tab === 'messages' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setUnreadOnly(false)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${!unreadOnly ? 'bg-umber text-white' : 'bg-white text-umber/55 border border-umber/15'}`}>All</button>
              <button onClick={() => setUnreadOnly(true)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${unreadOnly ? 'bg-umber text-white' : 'bg-white text-umber/55 border border-umber/15'}`}>Unread Only</button>
            </div>

            {loadingMessages ? <LoadingSpinner fullPage /> : messages.length === 0 ? (
              <div className="text-center py-20 warm-card">
                <FaEnvelopeOpenText className="text-3xl text-umber/20 mx-auto mb-3" />
                <p className="text-umber/45 font-medium">No messages found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`warm-card p-5 ${!msg.is_read ? 'border-rust/30' : ''}`}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-umber/10 flex items-center justify-center text-umber/55 shrink-0"><FaUser className="text-xs" /></div>
                          <div>
                            <p className="font-medium text-umber text-sm">{msg.name}</p>
                            <p className="text-xs text-umber/45">{msg.email}</p>
                          </div>
                        </div>
                        {!msg.is_read && <span className="text-[10px] font-semibold uppercase tracking-wide bg-rust/10 text-rust px-2.5 py-1 rounded-full shrink-0">New</span>}
                      </div>
                      {msg.subject && <p className="text-sm font-medium text-umber/80 mb-1">{msg.subject}</p>}
                      <p className="text-sm text-umber/60 leading-relaxed mb-4">{msg.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-umber/35">
                          {new Date(msg.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                        <div className="flex gap-2">
                          {!msg.is_read && <button onClick={() => handleMarkRead(msg.id)} className="flex items-center gap-1.5 text-xs font-medium text-rust px-3 py-1.5 rounded-lg border border-rust/30"><FaCheck className="text-[10px]" /> Mark Read</button>}
                          <button onClick={() => handleDeleteMessage(msg.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-500 px-3 py-1.5 rounded-lg border border-red-100"><FaTrash className="text-[10px]" /> Delete</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Therapist Add/Edit Modal */}
      <AnimatePresence>
        {showTherapistForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-umber/40 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowTherapistForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-7 w-full max-w-lg max-h-[85vh] overflow-y-auto">
              <h3 className="font-display text-xl font-semibold text-umber mb-5">{editingTherapist ? 'Edit Therapist' : 'Add New Therapist'}</h3>
              <form onSubmit={handleTherapistSubmit} className="space-y-4">
                <input required placeholder="Full Name" value={therapistForm.name} onChange={(e) => setTherapistForm({ ...therapistForm, name: e.target.value })} className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust" />
                <input required type="email" placeholder="Email" value={therapistForm.email} onChange={(e) => setTherapistForm({ ...therapistForm, email: e.target.value })} className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust" />
                <input
                  type="password"
                  placeholder={editingTherapist ? 'New password (leave blank to keep current)' : 'Password'}
                  required={!editingTherapist}
                  value={therapistForm.password}
                  onChange={(e) => setTherapistForm({ ...therapistForm, password: e.target.value })}
                  className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust"
                />
                <input placeholder="Title (e.g. Clinical Psychologist)" value={therapistForm.title} onChange={(e) => setTherapistForm({ ...therapistForm, title: e.target.value })} className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust" />
                <select required value={therapistForm.specialty_id} onChange={(e) => setTherapistForm({ ...therapistForm, specialty_id: e.target.value })} className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust">
                  <option value="">Select specialty</option>
                  {specialties.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Years Experience" value={therapistForm.years_experience} onChange={(e) => setTherapistForm({ ...therapistForm, years_experience: e.target.value })} className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust" />
                  <input type="number" placeholder="Fee (Rs.)" value={therapistForm.session_fee} onChange={(e) => setTherapistForm({ ...therapistForm, session_fee: e.target.value })} className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust" />
                </div>
                <textarea rows={3} placeholder="Bio" value={therapistForm.bio} onChange={(e) => setTherapistForm({ ...therapistForm, bio: e.target.value })} className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust resize-none" />

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowTherapistForm(false)} className="px-5 py-2.5 rounded-full text-sm font-medium text-umber/60">Cancel</button>
                  <button type="submit" disabled={savingTherapist} className="bg-rust text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-warm-sm disabled:opacity-60">
                    {savingTherapist ? 'Saving...' : editingTherapist ? 'Save Changes' : 'Add Therapist'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}