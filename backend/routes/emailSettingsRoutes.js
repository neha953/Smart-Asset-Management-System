const express = require("express");
const router = express.Router();

const { getEmailSettings, updateEmailSettings } = require("../controllers/emailSettingsController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

router.get("/", verifyToken, authorizeRole("Admin"), getEmailSettings);
router.put("/", verifyToken, authorizeRole("Admin"), updateEmailSettings);

module.exports = router;