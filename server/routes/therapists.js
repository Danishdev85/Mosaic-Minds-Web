const express = require("express");
const router = express.Router();

const { authenticate, requireRole } = require("../middleware/auth");

const {
  getAllTherapists,
  getTherapistById,
  createTherapist,
  updateTherapist,
  deleteTherapist,
  getOwnProfile,
} = require("../controllers/therapistController");

// Public routes
router.get("/", getAllTherapists);
router.get("/:id", getTherapistById);

// Therapist's own profile (any logged-in therapist)
router.get("/me/profile", authenticate, requireRole("therapist"), getOwnProfile);

// Admin-only management routes
router.post("/", authenticate, requireRole("admin"), createTherapist);
router.put("/:id", authenticate, requireRole("admin"), updateTherapist);
router.delete("/:id", authenticate, requireRole("admin"), deleteTherapist);

module.exports = router;