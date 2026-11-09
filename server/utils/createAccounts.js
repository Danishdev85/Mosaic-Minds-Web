const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

async function run() {
  try {
    // Create admin
    const adminHash = await bcrypt.hash("admin123", 10);
    await pool.execute(
      `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      ["Site Admin", "admin123@gmail.com", adminHash]
    );
    console.log("✅ Admin ready — admin123@gmail.com / admin123");

   // Create a sample therapist (needs a specialty_id — using 1, adjust if needed)
    const therapistHash = await bcrypt.hash("therapist123", 10);
    await pool.execute(
      `INSERT INTO therapists (specialty_id, name, email, password, title, bio, years_experience, session_fee)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      [1, "Dr. Amina Rahman", "amina123@gmail.com", therapistHash, "Clinical Psychologist", "Specializes in anxiety and stress management.", 8, 5000]
    );
    console.log("✅ Therapist ready — amina123@gmail.com / therapist123");
  } catch (error) {
    console.error("❌ Failed:", error.message);
  } finally {
    process.exit();
  }
}

run();