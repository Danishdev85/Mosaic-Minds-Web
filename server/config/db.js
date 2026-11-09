const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mosaic_minds_db",
  port: process.env.DB_PORT || 3306,
  dateStrings: true, // avoids timezone-shift bugs we hit in Vitalis
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function connectDatabase() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL (mosaic_minds_db)");
    conn.release();
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
  }
}

module.exports = { pool, connectDatabase };