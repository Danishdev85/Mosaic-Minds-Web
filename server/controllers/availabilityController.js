const { pool } = require("../config/db");

const VALID_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

// ======================================
// Get Availability for a Therapist (public)
// ======================================
const getTherapistAvailability = async (req, res) => {
  try {
    const { therapistId } = req.params;

    const [rows] = await pool.execute(
      `SELECT * FROM therapist_availability
       WHERE therapist_id = ?
       ORDER BY FIELD(day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')`,
      [therapistId]
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      availability: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability.",
    });
  }
};

// ======================================
// Add Availability — checks permission: admin OR the therapist themself
// ======================================
const addAvailability = async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { day_of_week, start_time, end_time } = req.body;

    // Permission check: admins can edit anyone, therapists can only edit their own
    if (req.user.role === "therapist" && String(req.user.id) !== String(therapistId)) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own availability.",
      });
    }

    if (!day_of_week || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "day_of_week, start_time, and end_time are required.",
      });
    }

    if (!VALID_DAYS.includes(day_of_week)) {
      return res.status(400).json({
        success: false,
        message: `day_of_week must be one of: ${VALID_DAYS.join(", ")}`,
      });
    }

    if (start_time >= end_time) {
      return res.status(400).json({
        success: false,
        message: "start_time must be before end_time.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO therapist_availability (therapist_id, day_of_week, start_time, end_time, is_active)
       VALUES (?, ?, ?, ?, TRUE)`,
      [therapistId, day_of_week, start_time, end_time]
    );

    res.status(201).json({
      success: true,
      message: "Availability added.",
      availabilityId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add availability.",
    });
  }
};

// ======================================
// Update Availability
// ======================================
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time, is_active } = req.body;

    // Look up who owns this row first, for the permission check
    const [existing] = await pool.execute(
      "SELECT therapist_id FROM therapist_availability WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Availability slot not found.",
      });
    }

    if (req.user.role === "therapist" && String(req.user.id) !== String(existing[0].therapist_id)) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own availability.",
      });
    }

    if (day_of_week && !VALID_DAYS.includes(day_of_week)) {
      return res.status(400).json({
        success: false,
        message: `day_of_week must be one of: ${VALID_DAYS.join(", ")}`,
      });
    }

    await pool.execute(
      `UPDATE therapist_availability
       SET day_of_week = COALESCE(?, day_of_week),
           start_time = COALESCE(?, start_time),
           end_time = COALESCE(?, end_time),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [day_of_week || null, start_time || null, end_time || null, is_active ?? null, id]
    );

    res.status(200).json({
      success: true,
      message: "Availability updated.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update availability.",
    });
  }
};

// ======================================
// Delete Availability
// ======================================
const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute(
      "SELECT therapist_id FROM therapist_availability WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Availability slot not found.",
      });
    }

    if (req.user.role === "therapist" && String(req.user.id) !== String(existing[0].therapist_id)) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own availability.",
      });
    }

    await pool.execute("DELETE FROM therapist_availability WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Availability deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete availability.",
    });
  }
};

module.exports = {
  getTherapistAvailability,
  addAvailability,
  updateAvailability,
  deleteAvailability,
};