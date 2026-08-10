const db = require("../config/db");

// Get All Audit Logs
const getAllAuditLogs = (callback) => {
    const sql = "SELECT * FROM audit_logs ORDER BY id DESC";
    db.query(sql, callback);
};

// Get Audit Log By ID
const getAuditLogById = (id, callback) => {
    const sql = "SELECT * FROM audit_logs WHERE id = ?";
    db.query(sql, [id], callback);
};

// Add Audit Log
const addAuditLog = (auditLog, callback) => {
    const sql = `
        INSERT INTO audit_logs
        (user_id, action, table_name)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [
        auditLog.user_id,
        auditLog.action,
        auditLog.table_name
    ], callback);
};

// Update Audit Log
const updateAuditLog = (id, auditLog, callback) => {
    const sql = `
        UPDATE audit_logs
        SET
            user_id = ?,
            action = ?,
            table_name = ?
        WHERE id = ?
    `;

    db.query(sql, [
        auditLog.user_id,
        auditLog.action,
        auditLog.table_name,
        id
    ], callback);
};

// Delete Audit Log
const deleteAuditLog = (id, callback) => {
    const sql = "DELETE FROM audit_logs WHERE id = ?";
    db.query(sql, [id], callback);
};

module.exports = {
    getAllAuditLogs,
    getAuditLogById,
    addAuditLog,
    updateAuditLog,
    deleteAuditLog
};