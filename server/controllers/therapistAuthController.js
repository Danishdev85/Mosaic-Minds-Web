const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
require("dotenv").config();

// ======================================
// Therapist Login
// ======================================
const therapistLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM therapists WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const therapist = rows[0];
    const isMatch = await bcrypt.compare(password, therapist.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: therapist.id, email: therapist.email, role: "therapist" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      therapist: {
        id: therapist.id,
        name: therapist.name,
        email: therapist.email,
        title: therapist.title,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

module.exports = { therapistLogin };