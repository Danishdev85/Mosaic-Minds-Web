const { pool } = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const [[{ total_appointments }]] = await pool.execute(
      "SELECT COUNT(*) AS total_appointments FROM appointments"
    );
    const [[{ pending_count }]] = await pool.execute(
      "SELECT COUNT(*) AS pending_count FROM appointments WHERE status = 'pending'"
    );
    const [[{ today_count }]] = await pool.execute(
      "SELECT COUNT(*) AS today_count FROM appointments WHERE appointment_date = CURDATE() AND status != 'cancelled'"
    );
    const [[{ total_therapists }]] = await pool.execute(
      "SELECT COUNT(*) AS total_therapists FROM therapists"
    );
    const [[{ total_specialties }]] = await pool.execute(
      "SELECT COUNT(*) AS total_specialties FROM specialties"
    );
    const [[{ unread_messages }]] = await pool.execute(
      "SELECT COUNT(*) AS unread_messages FROM contact_messages WHERE is_read = FALSE"
    );

    const [bySpecialty] = await pool.execute(`
      SELECT specialties.name AS specialty, COUNT(appointments.id) AS count
      FROM appointments
      INNER JOIN therapists ON appointments.therapist_id = therapists.id
      INNER JOIN specialties ON therapists.specialty_id = specialties.id
      WHERE appointments.status != 'cancelled'
      GROUP BY specialties.id, specialties.name
      ORDER BY count DESC
    `);

    res.status(200).json({
      success: true,
      stats: {
        total_appointments, pending_count, today_count,
        total_therapists, total_specialties, unread_messages,
        by_specialty: bySpecialty,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
};

module.exports = { getDashboardStats };