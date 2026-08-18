const express = require("express");

const router = express.Router();

const {
    getDashboardReport,
    getAssetReport,
    getMaintenanceReport,
    getWarrantyReport,
    getDepreciationReport,
    getLicenseReport
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

// Overall reports / dashboard summary
router.get(
    "/dashboard",
    authMiddleware,
    getDashboardReport
);

// Asset report
router.get(
    "/assets",
    authMiddleware,
    getAssetReport
);

// Maintenance report
router.get(
    "/maintenance",
    authMiddleware,
    getMaintenanceReport
);

// Warranty report
router.get(
    "/warranties",
    authMiddleware,
    getWarrantyReport
);

// Software license report
router.get(
    "/licenses",
    authMiddleware,
    getLicenseReport
);

// Depreciation report
router.get(
    "/depreciation",
    authMiddleware,
    getDepreciationReport
);

module.exports = router;