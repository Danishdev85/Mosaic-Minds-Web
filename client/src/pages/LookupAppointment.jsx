import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaUserMd, FaCalendarAlt, FaClock, FaTimesCircle,
  FaCheckCircle, FaHourglassHalf, FaBan, FaExclamationTriangle, FaVideo,
} from 'react-icons/fa';

import { lookupAppointment, cancelAppointment } from '../api/api.js';

const statusStyles = {
  pending: { icon: FaHourglassHalf, color: 'text-amber-700', bg: 'bg-amber/15', label: 'Pending Confirmation' },
  confirmed: { icon: FaCheckCircle, color: 'text-rust', bg: 'bg-rust/10', label: 'Confirmed' },
  cancelled: { icon: FaBan, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
  completed: { icon: FaCheckCircle, color: 'text-umber/60', bg: 'bg-umber/10', label: 'Completed' },
};

// Video join button becomes active 10 min before, stays active during a reasonable session window
function getSessionWindow(appointment) {
  const start = new Date(`${appointment.appointment_date}T${appointment.time_slot}`);
  const joinOpensAt = new Date(start.getTime() - 10 * 60 * 1000);
  const joinClosesAt = new Date(start.getTime() + 60 * 60 * 1000); // 1hr grace window after start
  const now = new Date();
  return { canJoin: now >= joinOpensAt && now <= joinClosesAt, joinOpensAt };
}

export default function LookupAppointment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ code: '', contact: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [appointment, setAppointment] = useState(null);

  const [cancelling, setCancelling] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelError, setCancelError] = useState('');

  function validate() {
    const errs = {};
    if (!form.code.trim()) errs.code = 'Confirmation code is required';
    if (!form.contact.trim()) errs.contact = 'Phone or email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setNotFound(false);
    setAppointment(null);
    try {
      const result = await lookupAppointment({
        confirmationCode: form.code.trim().toUpperCase(),
        contact: form.contact.trim(),
      });
      setAppointment(result);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    setCancelError('');
    try {
      await cancelAppointment({
        confirmationCode: form.code.trim().toUpperCase(),
        contact: form.contact.trim(),
      });
      setAppointment({ ...appointment, status: 'cancelled' });
      setConfirmingCancel(false);
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Could not cancel this session. Please try again.');
    } finally {
      setCancelling(false);
    }
  }

 function handleJoinSession() {
  if (!appointment.video_room_name) return;

  navigate(`/session/${appointment.video_room_name}`, {
    state: { appointment },
  });
}

  const status = appointment ? statusStyles[appointment.status] : null;
  const StatusIcon = status?.icon;
  const sessionWindow = appointment && appointment.status !== 'cancelled' ? getSessionWindow(appointment) : null;

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
        <span className="inline-block bg-amber/15 text-umber text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          My Session
        </span>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-umber mb-3">Find Your Session</h1>
        <p className="text-umber/55">Enter your confirmation code along with the phone or email you booked with.</p>
      </motion.div>

      <div className="warm-card p-7 lg:p-9">
        <form onSubmit={handleSearch} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-umber/75 mb-2">Confirmation Code</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="MM-XXXXX"
              className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm font-mono uppercase tracking-wider outline-none focus:border-rust transition-colors"
            />
            {errors.code && <p className="text-xs text-red-500 mt-1.5">{errors.code}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-umber/75 mb-2">Phone or Email</label>
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="+92 3XX XXXXXXX or you@email.com"
              className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors"
            />
            {errors.contact && <p className="text-xs text-red-500 mt-1.5">{errors.contact}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            className="w-full flex items-center justify-center gap-2 bg-rust text-white font-medium py-3.5 rounded-xl shadow-warm-sm disabled:opacity-60"
          >
            {loading ? 'Searching...' : <>Find My Session <FaSearch className="text-sm" /></>}
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {notFound && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 flex items-start gap-3 bg-red-50 text-red-600 rounded-2xl px-5 py-4">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <p className="text-sm">We couldn't find a matching session. Double-check your confirmation code and contact info.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appointment && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8 warm-card p-7">
            <div className={`inline-flex items-center gap-2 ${status.bg} ${status.color} text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6`}>
              <StatusIcon className="text-xs" /> {status.label}
            </div>

            <div className="space-y-4 mb-2">
              <div className="flex items-center gap-3 text-umber">
                <FaUserMd className="text-rust" />
                <span className="font-medium">{appointment.therapist_name}</span>
                <span className="text-umber/50 text-sm">· {appointment.title}</span>
              </div>
              <div className="flex items-center gap-3 text-umber">
                <FaCalendarAlt className="text-rust" />
                <span>{new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3 text-umber">
                <FaClock className="text-rust" />
                <span>{appointment.time_slot?.slice(0, 5)}</span>
              </div>
            </div>

            {appointment.reason && (
              <p className="mt-4 pt-4 border-t border-umber/10 text-sm text-umber/60">
                <strong className="text-umber/80">What brought you here:</strong> {appointment.reason}
              </p>
            )}

            {/* Join Session button — only for confirmed/pending, only within the join window */}
            {(appointment.status === 'pending' || appointment.status === 'confirmed') && appointment.video_room_name && (
              <div className="mt-6 pt-6 border-t border-umber/10">
                {sessionWindow.canJoin ? (
                  <motion.button
                    onClick={handleJoinSession}
                    whileHover={{ scale: 1.02 }}
                    className="breathe-cta w-full flex items-center justify-center gap-2 bg-rust text-white font-medium py-3.5 rounded-xl shadow-warm"
                  >
                    <FaVideo /> Join Video Session
                  </motion.button>
                ) : (
                  <div className="text-center text-sm text-umber/45 bg-umber/5 rounded-xl py-3.5">
                    Join link opens 10 minutes before your session
                    {' — '}
                    {sessionWindow.joinOpensAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                )}
              </div>
            )}

            {cancelError && <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{cancelError}</p>}

            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
              <div className="mt-6 pt-6 border-t border-umber/10">
                {!confirmingCancel ? (
                  <button onClick={() => setConfirmingCancel(true)} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
                    <FaTimesCircle /> Cancel this session
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-umber/65">Are you sure?</span>
                    <button onClick={handleCancel} disabled={cancelling} className="bg-red-500 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-60">
                      {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                    </button>
                    <button onClick={() => setConfirmingCancel(false)} className="text-sm font-medium text-umber/55 hover:text-umber transition-colors">
                      Keep Session
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-10">
        <Link to="/book" className="text-sm text-rust font-medium hover:underline">
          Need to book a new session instead?
        </Link>
      </div>
    </div>
  );
}