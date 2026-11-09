import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaClock } from 'react-icons/fa';

import {
  getTherapistSchedule, addTherapistSchedule, deleteTherapistSchedule,
} from '../api/api.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleManager({ therapistId }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ day_of_week: 'Monday', start_time: '09:00', end_time: '17:00' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function loadSchedule() {
    setLoading(true);
    getTherapistSchedule(therapistId)
      .then(setSchedule)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (therapistId) loadSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [therapistId]);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');

    if (form.start_time >= form.end_time) {
      setError('Start time must be before end time.');
      return;
    }

    setSaving(true);
    try {
      await addTherapistSchedule(therapistId, {
        day_of_week: form.day_of_week,
        start_time: `${form.start_time}:00`,
        end_time: `${form.end_time}:00`,
      });
      loadSchedule();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add availability.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTherapistSchedule(id);
      setSchedule((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Failed to remove this time block.');
    }
  }

  function formatTime(t) {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  }

  // Group existing schedule by day for a clean weekly display
  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = schedule.filter((s) => s.day_of_week === day);
    return acc;
  }, {});

  return (
    <div>
      <div className="warm-card p-6 mb-6">
        <h3 className="font-display font-semibold text-umber mb-1 flex items-center gap-2">
          <FaClock className="text-rust text-sm" /> Add Working Hours
        </h3>
        <p className="text-xs text-umber/45 mb-5">Set the days and times you're available for sessions.</p>

        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-umber/60 mb-1.5">Day</label>
            <select
              value={form.day_of_week}
              onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
              className="rounded-xl border border-umber/15 px-3 py-2.5 text-sm outline-none focus:border-rust"
            >
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-umber/60 mb-1.5">Start Time</label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              className="rounded-xl border border-umber/15 px-3 py-2.5 text-sm outline-none focus:border-rust"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-umber/60 mb-1.5">End Time</label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              className="rounded-xl border border-umber/15 px-3 py-2.5 text-sm outline-none focus:border-rust"
            />
          </div>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 bg-rust text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-warm-sm disabled:opacity-60"
          >
            <FaPlus className="text-xs" /> {saving ? 'Adding...' : 'Add'}
          </motion.button>
        </form>

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5 mt-4">{error}</p>}
      </div>

      {loading ? (
        <p className="text-sm text-umber/40 text-center py-8">Loading your schedule...</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {DAYS.map((day) => (
            <div key={day} className="warm-card p-5">
              <h4 className="font-display font-semibold text-umber mb-3">{day}</h4>
              {byDay[day].length === 0 ? (
                <p className="text-xs text-umber/35 italic">Not available</p>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {byDay[day].map((slot) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between bg-amber/[0.06] rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-umber/75">
                          {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                        </span>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="text-umber/30 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}