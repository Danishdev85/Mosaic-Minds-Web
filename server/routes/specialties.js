const express = require("express");
const router = express.Router();

const { authenticate, requireRole } = require("../middleware/auth");

const {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} = require("../controllers/specialtyController");

// Public routes
router.get("/", getAllSpecialties);
router.get("/:id", getSpecialtyById);

// Admin-only routes
router.post("/", authenticate, requireRole("admin"), createSpecialty);
router.put("/:id", authenticate, requireRole("admin"), updateSpecialty);
router.delete("/:id", authenticate, requireRole("admin"), deleteSpecialty);

module.exports = router;
