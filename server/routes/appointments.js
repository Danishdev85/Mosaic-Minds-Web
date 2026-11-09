const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth");

const {
  getAvailableSlots,
  createAppointment,
  lookupAppointment,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

// Public (guest) routes
router.get("/availability/:therapistId", getAvailableSlots);
router.post("/", createAppointment);
router.get("/lookup", lookupAppointment);
router.put("/cancel", cancelAppointment);

// Admin/Therapist routes (role-scoped inside controller)
router.get("/", authenticate, getAllAppointments);
router.put("/:id", authenticate, updateAppointmentStatus);

module.exports = router;