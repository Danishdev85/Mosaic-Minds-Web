import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaSun, FaCloudSun, FaMoon } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner.jsx';

function groupSlots(slots) {
  const groups = { Morning: [], Afternoon: [], Evening: [] };
  for (const slot of slots) {
    const hour = parseInt(slot.time.split(':')[0], 10);
    if (hour < 12) groups.Morning.push(slot);
    else if (hour < 17) groups.Afternoon.push(slot);
    else groups.Evening.push(slot);
  }
  return groups;
}

const groupIcons = { Morning: FaSun, Afternoon: FaCloudSun, Evening: FaMoon };

export default function TimeSlotPicker({ slots = [], selectedSlot, onSelectSlot, loading }) {
  if (loading) {
    return <div className="py-10"><LoadingSpinner label="Checking availability..." /></div>;
  }

  if (!slots.length) {
    return (
      <div className="warm-card p-8 text-center">
        <FaClock className="text-3xl text-umber/20 mx-auto mb-3" />
        <p className="text-sm text-umber/55 font-medium">No open slots for this date.</p>
        <p className="text-xs text-umber/35 mt-1">Try another date or a different therapist.</p>
      </div>
    );
  }

  const groups = groupSlots(slots);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([label, groupSlots]) => {
        if (!groupSlots.length) return null;
        const Icon = groupIcons[label];
        return (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3 text-umber/55">
              <Icon className="text-sm text-amber" />
              <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <AnimatePresence>
                {groupSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <motion.button
                      key={slot.time}
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => onSelectSlot(slot.time)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isSelected
                          ? 'bg-rust text-white shadow-glow'
                          : 'bg-white text-umber/70 border border-umber/15 hover:border-rust/40'
                      }`}
                    >
                      {slot.label}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}