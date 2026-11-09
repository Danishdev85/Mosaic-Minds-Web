const { pool } = require("../config/db");
const { generateConfirmationCode } = require("../utils/confirmationCode");
const { getDayName, buildAvailableSlots } = require("../utils/slotGenerator");
// ======================================
// Get Therapist Availability for a Date (slots)
// ======================================
const getAvailableSlots = async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "A 'date' query parameter is required (YYYY-MM-DD).",
      });
    }

    const dayName = getDayName(date);

    const [availabilityRows] = await pool.execute(
      `SELECT start_time, end_time FROM therapist_availability
       WHERE therapist_id = ? AND day_of_week = ? AND is_active = TRUE`,
      [therapistId, dayName]
    );

    const [bookedRows] = await pool.execute(
      `SELECT time_slot FROM appointments
       WHERE therapist_id = ? AND appointment_date = ? AND status != 'cancelled'`,
      [therapistId, date]
    );

    const bookedSlots = bookedRows.map((r) => r.time_slot);
    const slots = buildAvailableSlots(availabilityRows, bookedSlots, date);

    res.status(200).json({ success: true, date, day: dayName, slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch availability." });
  }
};

// ======================================
// Create Appointment (Guest Booking)
// ======================================
const createAppointment = async (req, res) => {
  try {
    const {
      therapist_id, client_name, client_email, client_phone,
      appointment_date, time_slot, reason,
    } = req.body;

    if (!therapist_id || !client_name || !client_email || !client_phone || !appointment_date || !time_slot) {
      return res.status(400).json({
        success: false,
        message: "therapist_id, client_name, client_email, client_phone, appointment_date, and time_slot are all required.",
      });
    }

    // Re-verify the slot is still free
    const dayName = getDayName(appointment_date);
    const [availabilityRows] = await pool.execute(
      `SELECT start_time, end_time FROM therapist_availability
       WHERE therapist_id = ? AND day_of_week = ? AND is_active = TRUE`,
      [therapist_id, dayName]
    );
    const [bookedRows] = await pool.execute(
      `SELECT time_slot FROM appointments
       WHERE therapist_id = ? AND appointment_date = ? AND status != 'cancelled'`,
      [therapist_id, appointment_date]
    );
    const bookedSlots = bookedRows.map((r) => r.time_slot);
    const freeSlots = buildAvailableSlots(availabilityRows, bookedSlots, appointment_date);
    const isStillFree = freeSlots.some((s) => s.time === time_slot);

    if (!isStillFree) {
      return res.status(409).json({
        success: false,
        message: "Sorry, that time slot was just taken. Please choose another.",
      });
    }

    // Generate unique confirmation code
    let confirmationCode;
    let isUnique = false;
    while (!isUnique) {
      confirmationCode = generateConfirmationCode();
      const [existing] = await pool.execute(
        "SELECT id FROM appointments WHERE confirmation_code = ?",
        [confirmationCode]
      );
      isUnique = existing.length === 0;
    }

   // Generate a unique Jitsi room name
const roomName = `mosaic-minds-${confirmationCode.toLowerCase()}`;

    const [result] = await pool.execute(
  `INSERT INTO appointments
    (therapist_id, client_name, client_email, client_phone, appointment_date, time_slot, reason, confirmation_code, video_room_name, status)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
  [
    therapist_id,
    client_name,
    client_email,
    client_phone,
    appointment_date,
    `${time_slot}:00`,
    reason || null,
    confirmationCode,
    roomName
  ]
);
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
     appointment: {
  id: result.insertId,
  confirmation_code: confirmationCode,
  therapist_id,
  client_name,
  appointment_date,
  time_slot,
  status: "pending",
  video_room_name: roomName,
},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to book appointment." });
  }
};

// ======================================
// Lookup Appointment (Guest)
// ======================================
const lookupAppointment = async (req, res) => {
  try {
    const { code, contact } = req.query;

    if (!code || !contact) {
      return res.status(400).json({
        success: false,
        message: "Confirmation code and contact (phone or email) are required.",
      });
    }

    const [rows] = await pool.execute(
      `SELECT appointments.*, therapists.name AS therapist_name, therapists.title
       FROM appointments
       INNER JOIN therapists ON appointments.therapist_id = therapists.id
       WHERE appointments.confirmation_code = ?
         AND (appointments.client_phone = ? OR appointments.client_email = ?)`,
      [code.trim().toUpperCase(), contact.trim(), contact.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No matching appointment found." });
    }

    res.status(200).json({ success: true, appointment: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to look up appointment." });
  }
};

// ======================================
// Cancel Appointment (Guest)
// ======================================
const cancelAppointment = async (req, res) => {
  try {
    const { code, contact } = req.body;

    if (!code || !contact) {
      return res.status(400).json({
        success: false,
        message: "Confirmation code and contact (phone or email) are required.",
      });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM appointments
       WHERE confirmation_code = ? AND (client_phone = ? OR client_email = ?)`,
      [code.trim().toUpperCase(), contact.trim(), contact.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No matching appointment found." });
    }

    if (rows[0].status === "cancelled") {
      return res.status(400).json({ success: false, message: "This appointment is already cancelled." });
    }

    await pool.execute("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [rows[0].id]);

    res.status(200).json({ success: true, message: "Appointment cancelled successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to cancel appointment." });
  }
};

// ======================================
// Admin/Therapist: Get Appointments
// ======================================
const getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT appointments.*, therapists.name AS therapist_name, therapists.title
      FROM appointments
      INNER JOIN therapists ON appointments.therapist_id = therapists.id
    `;
    const params = [];
    const conditions = [];

    // Therapists only see their own appointments; admins see everyone's
    if (req.user.role === "therapist") {
      conditions.push("appointments.therapist_id = ?");
      params.push(req.user.id);
    }

    if (status) {
      conditions.push("appointments.status = ?");
      params.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY appointments.appointment_date DESC, appointments.time_slot DESC";

    const [appointments] = await pool.execute(query, params);

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments." });
  }
};

// ======================================
// Admin/Therapist: Update Appointment Status
// ======================================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // If therapist, verify they own this appointment
    if (req.user.role === "therapist") {
      const [existing] = await pool.execute(
        "SELECT therapist_id FROM appointments WHERE id = ?",
        [id]
      );
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
      }
      if (String(existing[0].therapist_id) !== String(req.user.id)) {
        return res.status(403).json({ success: false, message: "You can only manage your own appointments." });
      }
    }

    await pool.execute("UPDATE appointments SET status = ? WHERE id = ?", [status, id]);

    res.status(200).json({ success: true, message: "Appointment status updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update appointment status." });
  }
};

module.exports = {
  getAvailableSlots,
  createAppointment,
  lookupAppointment,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};