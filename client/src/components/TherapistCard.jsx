import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBriefcaseMedical, FaArrowRight } from 'react-icons/fa';

export default function TherapistCard({ therapist, index = 0 }) {
  const initials = therapist.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="warm-card overflow-hidden"
    >
      <div className="relative h-44 bg-gradient-to-br from-amber/20 to-rust/10 flex items-center justify-center">
        {therapist.image ? (
          <img src={therapist.image} alt={therapist.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-5xl font-semibold text-rust/30">{initials}</span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-rust text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
          <FaBriefcaseMedical className="text-[10px]" /> {therapist.years_experience}+ yrs
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-umber mb-0.5">{therapist.name}</h3>
        <p className="text-sm text-rust font-medium mb-1">{therapist.title}</p>
        <p className="text-xs text-umber/45 mb-3">{therapist.specialty_name}</p>
        <p className="text-sm text-umber/60 leading-relaxed mb-4 line-clamp-2">{therapist.bio}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-umber">
            Rs. {Number(therapist.session_fee).toLocaleString()}
            <span className="text-xs text-umber/45 font-normal"> / session</span>
          </span>
        </div>

        <Link to={`/book?therapist=${therapist.id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 bg-rust text-white font-medium py-2.5 rounded-xl shadow-warm-sm hover:shadow-glow transition-all duration-300"
          >
            Book a Session <FaArrowRight className="text-xs" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}