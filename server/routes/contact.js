const express = require("express");
const router = express.Router();
const { authenticate, requireRole } = require("../middleware/auth");
const { submitMessage, getAllMessages, markAsRead, deleteMessage } = require("../controllers/contactController");

router.post("/", submitMessage);
router.get("/", authenticate, requireRole("admin"), getAllMessages);
router.put("/:id/read", authenticate, requireRole("admin"), markAsRead);
router.delete("/:id", authenticate, requireRole("admin"), deleteMessage);

module.exports = router;