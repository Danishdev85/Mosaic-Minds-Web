const { pool } = require("../config/db");

// ======================================
// Get Notes for an Appointment (therapist who owns it only)
// ======================================
const getNotesForAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Confirm this appointment belongs to the requesting therapist
    const [appt] = await pool.execute(
      "SELECT therapist_id FROM appointments WHERE id = ?",
      [appointmentId]
    );

    if (appt.length === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    if (String(appt[0].therapist_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You can only view notes for your own appointments.",
      });
    }

    const [notes] = await pool.execute(
      "SELECT * FROM session_notes WHERE appointment_id = ? ORDER BY created_at DESC",
      [appointmentId]
    );

    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch notes." });
  }
};

// ======================================
// Add a Note (therapist who owns the appointment only)
// ======================================
const addNote = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { notes } = req.body;

    if (!notes || !notes.trim()) {
      return res.status(400).json({ success: false, message: "Note content is required." });
    }

    const [appt] = await pool.execute(
      "SELECT therapist_id FROM appointments WHERE id = ?",
      [appointmentId]
    );

    if (appt.length === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    if (String(appt[0].therapist_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You can only add notes to your own appointments.",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO session_notes (appointment_id, therapist_id, notes) VALUES (?, ?, ?)",
      [appointmentId, req.user.id, notes.trim()]
    );

    res.status(201).json({
      success: true,
      message: "Note added.",
      noteId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add note." });
  }
};

// ======================================
// Delete a Note (therapist who wrote it only)
// ======================================
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const [note] = await pool.execute(
      "SELECT therapist_id FROM session_notes WHERE id = ?",
      [id]
    );

    if (note.length === 0) {
      return res.status(404).json({ success: false, message: "Note not found." });
    }

    if (String(note[0].therapist_id) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "You can only delete your own notes." });
    }

    await pool.execute("DELETE FROM session_notes WHERE id = ?", [id]);

    res.status(200).json({ success: true, message: "Note deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete note." });
  }
};

module.exports = { getNotesForAppointment, addNote, deleteNote };