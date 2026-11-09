import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaBrain, FaHeart, FaUsers, FaChild, FaShieldAlt, FaHandsHelping,
  FaHome, FaDove, FaArrowRight,
} from 'react-icons/fa';

const iconMap = {
  'Anxiety & Stress': FaBrain,
  'Depression': FaDove,
  'Couples Therapy': FaHeart,
  'Child Psychology': FaChild,
  'Trauma & PTSD': FaShieldAlt,
  'Addiction Counseling': FaHandsHelping,
  'Family Therapy': FaHome,
};

export default function SpecialtyCard({ specialty, index = 0 }) {
  const Icon = iconMap[specialty.name] || FaUsers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="warm-card group p-7"
    >
      <div className="w-14 h-14 rounded-2xl bg-rust/10 flex items-center justify-center text-rust text-2xl mb-5 transition-all duration-500 ease-calm group-hover:bg-rust group-hover:text-white group-hover:-rotate-6">
        <Icon />
      </div>
      <h3 className="font-display text-xl font-semibold text-umber mb-2">{specialty.name}</h3>
      <p className="text-sm text-umber/60 leading-relaxed mb-5">{specialty.description}</p>
      <Link
        to={`/therapists?specialty=${specialty.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-rust group-hover:gap-3 transition-all duration-300"
      >
        Find a Therapist <FaArrowRight className="text-xs" />
      </Link>
    </motion.div>
  );
}