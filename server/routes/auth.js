const express = require("express");
const router = express.Router();

const { adminLogin } = require("../controllers/adminController");
const { therapistLogin } = require("../controllers/therapistAuthController");

router.post("/admin/login", adminLogin);
router.post("/therapist/login", therapistLogin);

module.exports = router;