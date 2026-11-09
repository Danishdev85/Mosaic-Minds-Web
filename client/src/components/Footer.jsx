import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLeaf, FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaMapMarkerAlt,
  FaEnvelope, FaClock, FaLock, FaTimes, FaUserMd,
} from 'react-icons/fa';
import { adminLogin } from '../api/api.js';

const quickLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/therapists', label: 'Our Therapists' },
  { to: '/book', label: 'Book a Session' },
  { to: '/lookup', label: 'Find My Session' },
  { to: '/contact', label: 'Contact' },
];

const socials = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Secret trigger: Ctrl+Shift+X
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
        setShowAdminLogin(true);
      }
      if (e.key === 'Escape') {
        setShowAdminLogin(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function handleAdminLogin(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await adminLogin(form.email.trim(), form.password);
      localStorage.setItem('mm_token', result.token);
      localStorage.setItem('mm_role', 'admin');
      localStorage.setItem('mm_name', result.admin?.name || 'Admin');
      setShowAdminLogin(false);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="relative bg-umber text-white/90 mt-auto overflow-hidden">
      {/* Soft organic glow in the background */}
      <div className="blob w-96 h-96 bg-rust -bottom-32 -right-20 animate-blobFloatSlow" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber text-2xl"><FaLeaf /></span>
            <span className="font-display text-xl font-semibold text-white">Mosaic Minds</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            Compassionate therapy, made accessible — book a session and meet
            with your therapist from anywhere.
          </p>
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -3 }}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-amber hover:text-umber transition-colors duration-300"
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-display text-base font-semibold text-amber mb-5">Quick Links</h4>
          <ul className="space-y-3 mb-6">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-white/65 hover:text-amber transition-colors duration-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link to="/therapist/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-white/10 hover:bg-amber hover:text-umber text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-300"
            >
              <FaUserMd className="text-xs" /> Therapist Login
            </motion.button>
          </Link>
        </div>

        {/* Contact */}
        <div className="md:col-span-2">
          <h4 className="font-display text-base font-semibold text-amber mb-5">Get in Touch</h4>
          <div className="space-y-3.5">
            <div className="flex items-start gap-3 text-sm text-white/75">
              <FaMapMarkerAlt className="mt-1 text-amber shrink-0" />
              <span>221 Harmony Lane, Multan, Punjab, Pakistan</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/75">
              <FaPhoneAlt className="text-amber shrink-0" />
              <span>+92 300 7654321</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/75">
              <FaEnvelope className="text-amber shrink-0" />
              <span>hello@mosaicminds.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <FaClock className="text-amber/70 shrink-0" />
              <span>Mon–Sat · Sessions by appointment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Mosaic Minds. All rights reserved.</span>
          <span>Confidential & Compassionate Care</span>
        </div>
      </div>

      {/* Hidden Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-umber/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setShowAdminLogin(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-sm relative shadow-warm-lg text-umber"
            >
              <button
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-5 right-5 text-umber/40 hover:text-umber transition-colors"
              >
                <FaTimes />
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <span className="w-12 h-12 rounded-2xl bg-rust/10 text-rust flex items-center justify-center text-xl mb-3">
                  <FaLock />
                </span>
                <h3 className="font-display text-lg font-semibold text-umber">Admin Access</h3>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors"
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-umber/15 px-4 py-3 text-sm outline-none focus:border-rust transition-colors"
                />

                {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-rust text-white font-medium py-3 rounded-xl shadow-warm-sm hover:shadow-glow transition-all disabled:opacity-60"
                >
                  {submitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}