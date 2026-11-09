const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./config/db");

const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// Health Check
// -------------------------
app.get("/", (req, res) => {
  res.json({ message: "Mosaic Minds API is running." });
});

// -------------------------
// API Routes
// -------------------------

const authRoutes = require("./routes/auth");
const specialtyRoutes = require("./routes/specialties");
const therapistRoutes = require("./routes/therapists");
const availabilityRoutes = require("./routes/availability");
const appointmentRoutes = require("./routes/appointments");
const sessionNotesRoutes = require("./routes/sessionNotes");
const contactRoutes = require("./routes/contact");
const statsRoutes = require("./routes/stats");



app.use("/api/auth", authRoutes);
app.use("/api/specialties", specialtyRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/session-notes", sessionNotesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);


// -------------------------
// 404 Handler
// -------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// -------------------------
// Start Server
// -------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`🚀 Mosaic Minds API running on http://localhost:${PORT}`);
});