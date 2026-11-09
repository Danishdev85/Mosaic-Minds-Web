const { pool } = require("../config/db");

// ======================================
// Get All Specialties
// ======================================
const getAllSpecialties = async (req, res) => {
  try {
    const [specialties] = await pool.execute(
      "SELECT * FROM specialties ORDER BY name ASC"
    );

    res.status(200).json({
      success: true,
      count: specialties.length,
      specialties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch specialties.",
    });
  }
};

// ======================================
// Get Specialty By ID
// ======================================
const getSpecialtyById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM specialties WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Specialty not found.",
      });
    }

    res.status(200).json({
      success: true,
      specialty: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch specialty.",
    });
  }
};

// ======================================
// Create Specialty (Admin)
// ======================================
const createSpecialty = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Specialty name is required.",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO specialties (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    res.status(201).json({
      success: true,
      message: "Specialty created successfully.",
      specialtyId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create specialty.",
    });
  }
};

// ======================================
// Update Specialty (Admin)
// ======================================
const updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    await pool.execute(
      "UPDATE specialties SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );

    res.status(200).json({
      success: true,
      message: "Specialty updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update specialty.",
    });
  }
};

// ======================================
// Delete Specialty (Admin)
// ======================================
const deleteSpecialty = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute("DELETE FROM specialties WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Specialty deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete specialty.",
    });
  }
};

module.exports = {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};