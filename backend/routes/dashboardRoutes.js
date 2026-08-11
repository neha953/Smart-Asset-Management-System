const express = require("express");

const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// Dashboard — Admin only
router.get(
    "/",
    verifyToken,
    authorizeRole("Admin"),
    getDashboard
);

module.exports = router;