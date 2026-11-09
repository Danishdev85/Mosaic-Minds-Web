const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const SLOT_DURATION_MINUTES = 50; // therapy sessions are typically 50 min, not 30
const PK_OFFSET_MINUTES = 5 * 60;

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}:00`;
}

function formatLabel(time24) {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function getPakistanNow() {
  const nowUtcMs = Date.now();
  return new Date(nowUtcMs + PK_OFFSET_MINUTES * 60 * 1000);
}

function getDayName(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return DAY_NAMES[date.getUTCDay()];
}

function buildAvailableSlots(availabilityRows, bookedSlots, dateStr) {
  const slots = [];
  const bookedSet = new Set(bookedSlots.map((s) => s.toString().slice(0, 8)));

  const pkNow = getPakistanNow();
  const todayStr = `${pkNow.getUTCFullYear()}-${String(pkNow.getUTCMonth() + 1).padStart(2, "0")}-${String(pkNow.getUTCDate()).padStart(2, "0")}`;
  const isToday = dateStr === todayStr;
  const nowMinutes = pkNow.getUTCHours() * 60 + pkNow.getUTCMinutes();

  for (const row of availabilityRows) {
    const start = timeToMinutes(row.start_time);
    const end = timeToMinutes(row.end_time);

    for (let t = start; t + SLOT_DURATION_MINUTES <= end; t += SLOT_DURATION_MINUTES) {
      if (isToday && t <= nowMinutes) continue;
      const timeStr = minutesToTime(t);
      if (!bookedSet.has(timeStr)) {
        const time24 = timeStr.slice(0, 5);
        slots.push({ time: time24, label: formatLabel(time24) });
      }
    }
  }

  return slots;
}

module.exports = { getDayName, buildAvailableSlots };