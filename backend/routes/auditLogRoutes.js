const express = require("express");

const router = express.Router();

const {
    getAllAuditLogs,
    getAuditLogById,
    addAuditLog,
    updateAuditLog,
    deleteAuditLog
} = require("../controllers/auditLogController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const canManage = authorizeRole("Admin");

router.get("/", authMiddleware, canManage, getAllAuditLogs);
router.get("/:id", authMiddleware, canManage, getAuditLogById);
router.post("/", authMiddleware, canManage, addAuditLog);
router.put("/:id", authMiddleware, canManage, updateAuditLog);
router.delete("/:id", authMiddleware, canManage, deleteAuditLog);

module.exports = router;