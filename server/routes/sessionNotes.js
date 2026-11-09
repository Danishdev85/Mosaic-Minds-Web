const express = require("express");
const router = express.Router();

const { authenticate, requireRole } = require("../middleware/auth");

const {
  getNotesForAppointment,
  addNote,
  deleteNote,
} = require("../controllers/sessionNotesController");

// All routes require a logged-in therapist — ownership checked inside controllers
router.get("/appointment/:appointmentId", authenticate, requireRole("therapist"), getNotesForAppointment);
router.post("/appointment/:appointmentId", authenticate, requireRole("therapist"), addNote);
router.delete("/:id", authenticate, requireRole("therapist"), deleteNote);

module.exports = router;
