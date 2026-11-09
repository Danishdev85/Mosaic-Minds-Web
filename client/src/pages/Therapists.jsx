import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import TherapistCard from '../components/TherapistCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getSpecialties, getTherapists } from '../api/api.js';

export default function Therapists() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSpecialty = searchParams.get('specialty') || '';

  const [specialties, setSpecialties] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [therapistsLoading, setTherapistsLoading] = useState(false);

  useEffect(() => {
    getSpecialties().then(setSpecialties).catch(() => {});
  }, []);

  useEffect(() => {
    setTherapistsLoading(true);
    getTherapists(activeSpecialty || undefined)
      .then(setTherapists)
      .catch(() => {})
      .finally(() => {
        setTherapistsLoading(false);
        setLoading(false);
      });
  }, [activeSpecialty]);

  function selectSpecialty(id) {
    if (id) setSearchParams({ specialty: id });
    else setSearchParams({});
  }

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="blob w-80 h-80 bg-amber -top-20 -left-20 animate-blobFloatSlow" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-amber/15 text-umber text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              Our Therapists
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-umber mb-4">
              Find the Right Fit for You
            </h1>
            <p className="text-umber/55 text-base lg:text-lg leading-relaxed">
              Every therapist here is licensed, experienced, and ready to help
              — browse by specialty or explore everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2.5 justify-center"
        >
          <button
            onClick={() => selectSpecialty('')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              !activeSpecialty ? 'bg-rust text-white shadow-warm-sm' : 'bg-white text-umber/65 border border-umber/15 hover:border-rust/40'
            }`}
          >
            All Specialties
          </button>
          {specialties.map((s) => (
            <button
              key={s.id}
              onClick={() => selectSpecialty(String(s.id))}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSpecialty === String(s.id) ? 'bg-rust text-white shadow-warm-sm' : 'bg-white text-umber/65 border border-umber/15 hover:border-rust/40'
              }`}
            >
              {s.name}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        {loading || therapistsLoading ? (
          <LoadingSpinner fullPage label="Finding therapists..." />
        ) : therapists.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-umber/45 font-medium">No therapists found in this specialty yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((t, i) => (
              <TherapistCard key={t.id} therapist={t} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}