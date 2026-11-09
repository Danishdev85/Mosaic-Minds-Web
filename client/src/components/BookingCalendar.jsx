import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
export default function BookingCalendar({ selectedDate, onSelectDate, maxDaysAhead = 60 }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + maxDaysAhead);
    return d;
  }, [today, maxDaysAhead]);

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [viewDate]);

  const canGoPrev = viewDate > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = viewDate < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  function changeMonth(delta) {
    setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }

  function isDisabled(date) {
    if (!date) return true;
    return date < today || date > maxDate;
  }

  return (
    <div className="warm-card p-6">
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() => canGoPrev && changeMonth(-1)}
          disabled={!canGoPrev}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            canGoPrev ? 'bg-rust/10 text-rust hover:bg-rust/20' : 'text-umber/20 cursor-not-allowed'
          }`}
        >
          <FaChevronLeft className="text-xs" />
        </button>

        <AnimatePresence mode="wait">
          <motion.span
            key={monthLabel}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="font-display font-semibold text-umber"
          >
            {monthLabel}
          </motion.span>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => canGoNext && changeMonth(1)}
          disabled={!canGoNext}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            canGoNext ? 'bg-rust/10 text-rust hover:bg-rust/20' : 'text-umber/20 cursor-not-allowed'
          }`}
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d) => (
          <span key={d} className="text-center text-xs font-medium text-umber/35 py-1">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((date, i) => {
          if (!date) return <span key={`empty-${i}`} />;
          const disabled = isDisabled(date);
          const isSelected = selectedDate && toDateKey(date) === toDateKey(selectedDate);
          const isToday = toDateKey(date) === toDateKey(today);

          return (
            <motion.button
              key={toDateKey(date)}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(date)}
              whileHover={!disabled ? { scale: 1.08 } : {}}
              whileTap={!disabled ? { scale: 0.92 } : {}}
              className={`aspect-square rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-300
                ${disabled ? 'text-umber/20 cursor-not-allowed' : 'text-umber/75 hover:bg-rust/5'}
                ${isSelected ? 'bg-rust text-white shadow-glow' : ''}
                ${isToday && !isSelected ? 'ring-1 ring-amber' : ''}
              `}
            >
              {date.getDate()}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}