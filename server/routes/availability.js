const express = require("express");
const router = express.Router();

const { authenticate, requireRole } = require("../middleware/auth");

const {
  getTherapistAvailability,
  addAvailability,
  updateAvailability,
  deleteAvailability,
} = require("../controllers/availabilityController");

// Public — view a therapist's weekly schedule
router.get("/therapist/:therapistId", getTherapistAvailability);

// Protected — admin OR the therapist themself (permission checked inside controller)
router.post("/therapist/:therapistId", authenticate, addAvailability);
router.put("/:id", authenticate, updateAvailability);
router.delete("/:id", authenticate, deleteAvailability);

module.exports = router;