import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle, FaArrowLeft, FaArrowRight, FaCopy, FaUserMd,
  FaVideo, FaCalendarAlt, FaClock,
} from 'react-icons/fa';

import BookingCalendar from '../components/BookingCalendar.jsx';
import TimeSlotPicker from '../components/TimeSlotPicker.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
  getSpecialties, getTherapists, getAvailableSlots, createAppointment,
} from '../api/api.js';

const STEPS = ['Therapist', 'Date & Time', 'Your Details', 'Confirmed'];

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const preselectedTherapist = searchParams.get('therapist');

  const [step, setStep] = useState(0);

  const [specialties, setSpecialties] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [activeSpecialty, setActiveSpecialty] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [loadingTherapists, setLoadingTherapists] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '', email: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    getSpecialties().then(setSpecialties).catch(() => {});
  }, []);

  useEffect(() => {
    setLoadingTherapists(true);
    getTherapists(activeSpecialty || undefined)
      .then((data) => {
        setTherapists(data);
        if (preselectedTherapist && !selectedTherapist) {
          const match = data.find((t) => String(t.id) === preselectedTherapist);
          if (match) setSelectedTherapist(match);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingTherapists(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSpecialty]);

  useEffect(() => {
    if (!selectedTherapist || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    getAvailableSlots(selectedTherapist.id, toDateKey(selectedDate))
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedTherapist, selectedDate]);

  const canGoStep2 = !!selectedTherapist;
  const canGoStep3 = !!selectedTherapist && !!selectedDate && !!selectedSlot;

  function validateForm() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!/^[0-9+\-\s]{7,20}$/.test(form.phone.trim())) errs.phone = 'Enter a valid phone number';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'A valid email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await createAppointment({
        therapist_id: selectedTherapist.id,
        appointment_date: toDateKey(selectedDate),
        time_slot: selectedSlot,
        client_name: form.name.trim(),
        client_phone: form.phone.trim(),
        client_email: form.email.trim(),
        reason: form.reason.trim() || null,
      });
      setConfirmation(result);
      setStep(3);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Something went wrong. That slot may have just been taken — please pick another.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function copyCode() {
    if (confirmation?.confirmation_code) {
      navigator.clipboard.writeText(confirmation.confirmation_code);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="inline-block bg-amber/15 text-umber text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          Book a Session
        </span>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-umber">
          Let's Find You Support
        </h1>
      </motion.div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
                  ${i < step ? 'bg-rust text-white' : i === step ? 'bg-rust text-white shadow-glow' : 'bg-umber/10 text-umber/35'}`}
              >
                {i < step ? <FaCheckCircle className="text-sm" /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium hidden sm:block ${i <= step ? 'text-umber' : 'text-umber/35'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 sm:w-16 h-[2px] mx-1 sm:mx-2 transition-colors duration-500 ${i < step ? 'bg-rust' : 'bg-umber/10'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 0 — Choose therapist */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-wrap gap-2.5 justify-center mb-8">
              <button
                onClick={() => setActiveSpecialty('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!activeSpecialty ? 'bg-rust text-white shadow-glow' : 'bg-white text-umber/65 border border-umber/15'}`}
              >
                All
              </button>
              {specialties.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSpecialty(String(s.id))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSpecialty === String(s.id) ? 'bg-rust text-white shadow-glow' : 'bg-white text-umber/65 border border-umber/15'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {loadingTherapists ? (
              <LoadingSpinner fullPage />
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {therapists.map((t) => {
                  const isSelected = selectedTherapist?.id === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTherapist(t)}
                      className={`text-left rounded-2xl p-5 border transition-all duration-300 flex gap-4 items-start
                        ${isSelected ? 'border-rust bg-rust/5 shadow-glow' : 'border-umber/15 bg-white hover:border-rust/30'}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-rust/10 flex items-center justify-center text-rust shrink-0">
                        <FaUserMd />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-umber">{t.name}</p>
                        <p className="text-sm text-rust font-medium mb-1">{t.title}</p>
                        <p className="text-xs text-umber/45">Rs. {Number(t.session_fee).toLocaleString()} / session</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end mt-10">
              <motion.button
                whileHover={{ scale: canGoStep2 ? 1.03 : 1 }}
                disabled={!canGoStep2}
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 px-7 py-3 rounded-full font-medium transition-all ${canGoStep2 ? 'bg-rust text-white shadow-warm-sm' : 'bg-umber/10 text-umber/30 cursor-not-allowed'}`}
              >
                Continue <FaArrowRight className="text-sm" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 1 — Date & time */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-2 gap-8">
            <BookingCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} maxDaysAhead={60} />

            <div>
              <h3 className="font-display font-semibold text-umber mb-4">
                {selectedDate ? `Available on ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}` : 'Pick a date to see open times'}
              </h3>
              {selectedDate && (
                <TimeSlotPicker slots={slots} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} loading={loadingSlots} />
              )}
            </div>

            <div className="md:col-span-2 flex justify-between mt-4">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-umber/60 hover:text-rust transition-colors">
                <FaArrowLeft className="text-sm" /> Back
              </button>
              <motion.button
                whileHover={{ scale: canGoStep3 ? 1.03 : 1 }}
                disabled={!canGoStep3}
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 px-7 py-3 rounded-full font-medium transition-all ${canGoStep3 ? 'bg-rust text-white shadow-warm-sm' : 'bg-umber/10 text-umber/30 cursor-not-allowed'}`}
              >
                Continue <FaArrowRight className="text-sm" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Details */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="warm-card p-7 lg:p-9">
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-7 pb-6 border-b border-umber/10 text-sm text-umber/65">
                <span><strong className="text-umber">{selectedTherapist.name}</strong> · {selectedTherapist.title}</span>
                <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span>{selectedSlot}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-umber/75 mb-2">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ayesha Tariq"
                    className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-umber/75 mb-2">Phone Number</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-umber/75 mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-umber/75 mb-2">What brings you here? (optional)</label>
                  <textarea
                    rows={4}
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Share as much or as little as you'd like..."
                    className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors resize-none"
                  />
                </div>

                {submitError && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{submitError}</p>}

                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-umber/60 hover:text-rust transition-colors">
                    <FaArrowLeft className="text-sm" /> Back
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-2 bg-rust text-white px-7 py-3 rounded-full font-medium shadow-warm-sm disabled:opacity-60"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Booking'} <FaArrowRight className="text-sm" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Confirmation */}
        {step === 3 && confirmation && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-amber/15 text-amber flex items-center justify-center text-4xl mx-auto mb-6"
            >
              <FaCheckCircle />
            </motion.div>

            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-umber mb-2">You're All Set</h2>
            <p className="text-umber/55 mb-8">
              Your session with {selectedTherapist.name} is booked for{' '}
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedSlot}.
            </p>

            <div className="warm-card max-w-sm mx-auto mb-6 p-6">
              <p className="text-xs uppercase tracking-wide text-umber/45 mb-2">Confirmation Code</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-display text-2xl font-semibold text-rust tracking-wider">
                  {confirmation.confirmation_code}
                </span>
                <button onClick={copyCode} className="text-umber/35 hover:text-rust transition-colors" aria-label="Copy code">
                  <FaCopy />
                </button>
              </div>
              <p className="text-xs text-umber/40 mt-3">
                Save this — you'll need it with your phone/email to find or cancel your session.
              </p>
            </div>

            {confirmation.video_room_url && (
              <div className="warm-card max-w-sm mx-auto mb-8 p-6 bg-rust/[0.03]">
                <FaVideo className="text-rust text-xl mx-auto mb-2" />
                <p className="text-sm text-umber/65 leading-relaxed">
                  Your video session link is ready. It'll become active a few
                  minutes before your appointment — access it anytime via{' '}
                  <Link to="/lookup" className="text-rust font-medium hover:underline">My Session</Link>.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/">
                <button className="px-6 py-3 rounded-full font-medium text-umber/65 border border-umber/15 hover:border-rust/40 transition-colors">
                  Back to Home
                </button>
              </Link>
              <Link to="/lookup">
                <button className="bg-rust text-white px-6 py-3 rounded-full font-medium shadow-warm-sm">
                  View My Session
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}