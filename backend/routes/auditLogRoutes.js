const express = require("express");

const router = express.Router();

const {
    getAllAuditLogs,
    getAuditLogById,
    addAuditLog,
    updateAuditLog,
    deleteAuditLog
} = require("../controllers/auditLogController");

// GET all audit logs
router.get("/", getAllAuditLogs);

// GET audit log by ID
router.get("/:id", getAuditLogById);

// POST add audit log
router.post("/", addAuditLog);

// PUT update audit log
router.put("/:id", updateAuditLog);

// DELETE audit log
router.delete("/:id", deleteAuditLog);

module.exports = router;