const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

// ======================================
// Get All Therapists (optionally filtered by specialty)
// ======================================
const getAllTherapists = async (req, res) => {
  try {
    const { specialty } = req.query;

    let query = `
      SELECT
        therapists.id, therapists.specialty_id, therapists.name, therapists.email,
        therapists.title, therapists.bio, therapists.years_experience,
        therapists.session_fee, therapists.image, therapists.created_at,
        specialties.name AS specialty_name
      FROM therapists
      INNER JOIN specialties ON therapists.specialty_id = specialties.id
    `;
    const params = [];

    if (specialty) {
      query += " WHERE therapists.specialty_id = ?";
      params.push(specialty);
    }

    query += " ORDER BY therapists.name ASC";

    const [therapists] = await pool.execute(query, params);

    res.status(200).json({
      success: true,
      count: therapists.length,
      therapists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch therapists.",
    });
  }
};

// ======================================
// Get Therapist By ID
// ======================================
const getTherapistById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT
        therapists.id, therapists.specialty_id, therapists.name, therapists.email,
        therapists.title, therapists.bio, therapists.years_experience,
        therapists.session_fee, therapists.image, therapists.created_at,
        specialties.name AS specialty_name
      FROM therapists
      INNER JOIN specialties ON therapists.specialty_id = specialties.id
      WHERE therapists.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found.",
      });
    }

    res.status(200).json({
      success: true,
      therapist: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch therapist.",
    });
  }
};

// ======================================
// Create Therapist (Admin only)
// ======================================
const createTherapist = async (req, res) => {
  try {
    const {
      specialty_id, name, email, password, title,
      bio, years_experience, session_fee, image,
    } = req.body;

    if (!specialty_id || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Specialty, name, email, and password are required.",
      });
    }

    // Check email isn't already used
    const [existing] = await pool.execute(
      "SELECT id FROM therapists WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A therapist with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO therapists
        (specialty_id, name, email, password, title, bio, years_experience, session_fee, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        specialty_id, name, email, passwordHash,
        title || null, bio || null, years_experience || 0,
        session_fee || 0, image || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Therapist created successfully.",
      therapistId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create therapist.",
    });
  }
};

// ======================================
// Update Therapist (Admin only)
// ======================================
const updateTherapist = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      specialty_id, name, email, title,
      bio, years_experience, session_fee, image, password,
    } = req.body;

    // If a new password was provided, hash it; otherwise keep the old one
    let passwordClause = "";
    const params = [
      specialty_id, name, email, title, bio,
      years_experience, session_fee, image,
    ];

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      passwordClause = ", password = ?";
      params.push(passwordHash);
    }

    params.push(id);

    await pool.execute(
      `UPDATE therapists
       SET specialty_id = ?, name = ?, email = ?, title = ?, bio = ?,
           years_experience = ?, session_fee = ?, image = ?${passwordClause}
       WHERE id = ?`,
      params
    );

    res.status(200).json({
      success: true,
      message: "Therapist updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update therapist.",
    });
  }
};

// ======================================
// Delete Therapist (Admin only)
// ======================================
const deleteTherapist = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute("DELETE FROM therapists WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Therapist deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete therapist.",
    });
  }
};

// ======================================
// Get Own Profile (Therapist — using their own token)
// ======================================
const getOwnProfile = async (req, res) => {
  try {
    const therapistId = req.user.id; // comes from the JWT, not a URL param

    const [rows] = await pool.execute(
      `SELECT
        therapists.id, therapists.specialty_id, therapists.name, therapists.email,
        therapists.title, therapists.bio, therapists.years_experience,
        therapists.session_fee, therapists.image, therapists.created_at,
        specialties.name AS specialty_name
      FROM therapists
      INNER JOIN specialties ON therapists.specialty_id = specialties.id
      WHERE therapists.id = ?`,
      [therapistId]
    );

    res.status(200).json({
      success: true,
      therapist: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

module.exports = {
  getAllTherapists,
  getTherapistById,
  createTherapist,
  updateTherapist,
  deleteTherapist,
  getOwnProfile,
};