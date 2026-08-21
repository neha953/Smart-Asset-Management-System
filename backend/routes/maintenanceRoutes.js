const express = require("express");

const router = express.Router();

const {
    getAllMaintenance,
    getMaintenanceById,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance
} = require("../controllers/maintenanceController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const canManage = authorizeRole("Admin");

router.get("/", authMiddleware, canManage, getAllMaintenance);
router.get("/:id", authMiddleware, canManage, getMaintenanceById);
router.post("/", authMiddleware, canManage, addMaintenance);
router.put("/:id", authMiddleware, canManage, updateMaintenance);
router.delete("/:id", authMiddleware, canManage, deleteMaintenance);

module.exports = router;