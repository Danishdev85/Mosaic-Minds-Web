import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight, FaVideo, FaUserMd, FaLock, FaCalendarCheck, FaLeaf,
} from 'react-icons/fa';

import SpecialtyCard from '../components/SpecialtyCard.jsx';
import TherapistCard from '../components/TherapistCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getSpecialties, getTherapists } from '../api/api.js';

const perks = [
  { icon: FaCalendarCheck, title: 'Easy Booking', text: 'Choose your therapist and time — confirmed in under a minute, no account needed.' },
  { icon: FaVideo, title: 'Sessions From Anywhere', text: 'Meet your therapist through a secure video call, right in your browser.' },
  { icon: FaUserMd, title: 'Licensed Therapists', text: 'Every therapist is credentialed, experienced, and matched to your needs.' },
  { icon: FaLock, title: 'Private & Confidential', text: 'Your sessions and information are handled with strict confidentiality.' },
];

export default function Home() {
  const [specialties, setSpecialties] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSpecialties(), getTherapists()])
      .then(([specData, therData]) => {
        setSpecialties(specData.slice(0, 6));
        setTherapists(therData.slice(0, 3));
      })
      .catch((err) => console.error('Failed to load home data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        {/* Organic floating blobs */}
        <div className="blob w-[28rem] h-[28rem] bg-amber -top-40 -left-32 animate-blobFloat" />
        <div className="blob w-96 h-96 bg-clay top-20 -right-20 animate-blobFloatSlow" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 bg-amber/15 text-umber text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <FaLeaf className="text-amber" /> A calmer way to find support
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-umber leading-[1.1] mb-6">
              Therapy that meets you <span className="text-rust">where you are.</span>
            </h1>

            <p className="text-umber/60 text-base sm:text-lg leading-relaxed mb-9 max-w-lg">
              Connect with licensed therapists for anxiety, relationships, grief,
              and more — book a session in minutes and meet from the comfort
              of home.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/book">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="breathe-cta bg-rust text-white font-medium px-7 py-3.5 rounded-full shadow-warm flex items-center gap-2"
                >
                  Book a Session <FaArrowRight className="text-sm" />
                </motion.button>
              </Link>
              <Link to="/therapists">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-white text-umber font-medium px-7 py-3.5 rounded-full border border-umber/15 hover:border-rust/40 transition-colors duration-300"
                >
                  Meet Our Therapists
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative"
          >
            <div className="warm-card p-10 lg:p-12 text-center">
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex w-20 h-20 rounded-full bg-amber/15 text-amber items-center justify-center text-3xl mb-6"
              >
                <FaVideo />
              </motion.span>
              <h3 className="font-display text-xl font-semibold text-umber mb-2">
                Live Video Sessions
              </h3>
              <p className="text-sm text-umber/55 leading-relaxed">
                Meet your therapist face-to-face through a secure, private
                video room — built right into the site.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- PERKS ---------------- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="warm-card p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-rust/10 text-rust flex items-center justify-center text-lg mb-4">
                  <Icon />
                </div>
                <h3 className="font-display font-semibold text-umber mb-1.5">{perk.title}</h3>
                <p className="text-sm text-umber/55 leading-relaxed">{perk.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------- SPECIALTIES ---------------- */}
      <section className="relative bg-amber/[0.04] py-20 overflow-hidden">
        <div className="blob w-80 h-80 bg-clay bottom-0 -left-24 animate-blobFloatSlow" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-3xl font-semibold text-umber mb-2">
                Support For What You're Facing
              </h2>
              <p className="text-umber/55 max-w-md">
                Whatever brings you here, there's a therapist who specializes in it.
              </p>
            </div>
            <Link to="/therapists" className="hidden sm:flex items-center gap-2 text-rust font-medium text-sm hover:gap-3 transition-all">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </motion.div>

          {loading ? (
            <LoadingSpinner fullPage label="Loading specialties..." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialties.map((s, i) => (
                <SpecialtyCard key={s.id} specialty={s} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- THERAPISTS PREVIEW ---------------- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="font-display text-3xl font-semibold text-umber mb-2">
              Meet Our Therapists
            </h2>
            <p className="text-umber/55 max-w-md">
              Experienced, licensed professionals ready to support you.
            </p>
          </div>
          <Link to="/therapists" className="hidden sm:flex items-center gap-2 text-rust font-medium text-sm hover:gap-3 transition-all">
            View All <FaArrowRight className="text-xs" />
          </Link>
        </motion.div>

        {loading ? (
          <LoadingSpinner fullPage label="Loading therapists..." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((t, i) => (
              <TherapistCard key={t.id} therapist={t} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-umber rounded-[2.5rem] px-8 py-16 lg:py-20 text-center overflow-hidden"
        >
          <div className="blob w-96 h-96 bg-rust -top-20 -right-20 animate-blobFloat" />
          <div className="relative">
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-white mb-4">
              Taking the first step takes courage.
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              We're here to make the next one easier — book a session and talk
              to someone who's ready to listen.
            </p>
            <Link to="/book">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="breathe-cta bg-amber text-umber font-semibold px-8 py-3.5 rounded-full shadow-lg inline-flex items-center gap-2"
              >
                Book Your Session <FaArrowRight className="text-sm" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}