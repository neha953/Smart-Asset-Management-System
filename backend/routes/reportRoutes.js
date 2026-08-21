const express = require("express");

const router = express.Router();

const {
    getDashboardReport,
    getAssetReport,
    getMaintenanceReport,
    getWarrantyReport,
    getLicenseReport,
    getDepreciationReport
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const allowedRoles = authorizeRole("Admin", "SubAdmin", "ReportViewer");

router.get("/dashboard", authMiddleware, allowedRoles, getDashboardReport);
router.get("/assets", authMiddleware, allowedRoles, getAssetReport);
router.get("/maintenance", authMiddleware, allowedRoles, getMaintenanceReport);
router.get("/warranties", authMiddleware, allowedRoles, getWarrantyReport);
router.get("/licenses", authMiddleware, allowedRoles, getLicenseReport);
router.get("/depreciation", authMiddleware, allowedRoles, getDepreciationReport);

module.exports = router;