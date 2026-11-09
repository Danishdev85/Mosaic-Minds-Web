import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane, FaCheckCircle,
} from 'react-icons/fa';

import { submitContactMessage } from '../api/api.js';

const infoItems = [
  { icon: FaMapMarkerAlt, title: 'Location', text: '221 Harmony Lane, Multan, Punjab, Pakistan' },
  { icon: FaPhoneAlt, title: 'Phone', text: '+92 300 7654321' },
  { icon: FaEnvelope, title: 'Email', text: 'hello@mosaicminds.com' },
  { icon: FaClock, title: 'Hours', text: 'Mon–Sat · Sessions by appointment' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Enter a valid email';
    if (!form.message.trim()) errs.message = 'Please write a message';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Something went wrong sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="blob w-80 h-80 bg-clay -top-24 -right-24 animate-blobFloatSlow" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-amber/15 text-umber text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              Contact Us
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-umber mb-4">
              We're Here to Help
            </h1>
            <p className="text-umber/55 text-base lg:text-lg leading-relaxed">
              Questions about our therapists, sessions, or anything else —
              reach out and we'll respond within one business day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-umber rounded-3xl p-8 text-white relative overflow-hidden"
          >
            <div className="blob w-64 h-64 bg-rust -bottom-20 -right-16 animate-blobFloatSlow" />
            <h3 className="relative font-display text-xl font-semibold mb-6">Get in Touch</h3>
            <div className="relative space-y-6">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-amber shrink-0">
                      <Icon className="text-sm" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/45 mb-0.5">{item.title}</p>
                      <p className="text-sm text-white/80 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 warm-card p-8"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-amber/15 text-amber flex items-center justify-center text-3xl mb-5"
                  >
                    <FaCheckCircle />
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold text-umber mb-2">Message Sent</h3>
                  <p className="text-sm text-umber/55 max-w-xs">Thanks for reaching out — we'll get back to you within one business day.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-sm font-medium text-rust hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-umber/75 mb-2">Full Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
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
                    <label className="block text-sm font-medium text-umber/75 mb-2">Subject (optional)</label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="What's this about?"
                      className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-umber/75 mb-2">Message</label>
                    <textarea
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors resize-none"
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1.5">{errors.message}</p>}
                  </div>

                  {submitError && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{submitError}</p>}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rust text-white font-medium px-8 py-3.5 rounded-xl shadow-warm-sm disabled:opacity-60"
                  >
                    {submitting ? 'Sending...' : <>Send Message <FaPaperPlane className="text-sm" /></>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}