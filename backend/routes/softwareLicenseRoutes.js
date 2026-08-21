const express = require("express");

const router = express.Router();

const {
    getAllSoftwareLicenses,
    getSoftwareLicenseById,
    addSoftwareLicense,
    updateSoftwareLicense,
    deleteSoftwareLicense
} = require("../controllers/softwareLicenseController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const canManage = authorizeRole("Admin");

router.get("/", authMiddleware, canManage, getAllSoftwareLicenses);
router.get("/:id", authMiddleware, canManage, getSoftwareLicenseById);
router.post("/", authMiddleware, canManage, addSoftwareLicense);
router.put("/:id", authMiddleware, canManage, updateSoftwareLicense);
router.delete("/:id", authMiddleware, canManage, deleteSoftwareLicense);

module.exports = router;