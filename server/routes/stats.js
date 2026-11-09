const express = require("express");
const router = express.Router();
const { authenticate, requireRole } = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/statsController");

router.get("/", authenticate, requireRole("admin"), getDashboardStats);

module.exports = router;