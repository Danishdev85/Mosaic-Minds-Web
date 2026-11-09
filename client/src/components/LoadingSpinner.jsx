import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';

export default function LoadingSpinner({ label, fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.span
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="text-rust text-3xl"
      >
        <FaLeaf />
      </motion.span>
      {label && <span className="text-sm text-umber/50 font-medium">{label}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="min-h-[40vh] flex items-center justify-center">{content}</div>;
  }
  return content;
}