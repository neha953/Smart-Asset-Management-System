const auditLogModel = require("../models/auditLogModel");

// Get all audit logs
const getAllAuditLogs = (req, res) => {

    auditLogModel.getAllAuditLogs((err, results) => {

        if (err) {
            console.error("Get Audit Logs Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
};


// Get audit log by ID
const getAuditLogById = (req, res) => {

    const { id } = req.params;

    auditLogModel.getAuditLogById(id, (err, results) => {

        if (err) {
            console.error("Get Audit Log By ID Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};


// Add audit log
const addAuditLog = (req, res) => {

    const {
        user_id,
        action,
        table_name
    } = req.body;

    if (!user_id || !action) {
        return res.status(400).json({
            success: false,
            message: "User ID and action are required"
        });
    }

    const auditLog = {
        user_id,
        action,
        table_name
    };

    auditLogModel.addAuditLog(auditLog, (err, result) => {

        if (err) {
            console.error("Add Audit Log Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(201).json({
            success: true,
            message: "Audit log added successfully",
            auditLogId: result.insertId
        });
    });
};


// Update audit log
const updateAuditLog = (req, res) => {

    const { id } = req.params;

    const {
        user_id,
        action,
        table_name
    } = req.body;

    const auditLog = {
        user_id,
        action,
        table_name
    };

    auditLogModel.updateAuditLog(id, auditLog, (err, result) => {

        if (err) {
            console.error("Update Audit Log Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Audit log updated successfully"
        });
    });
};


// Delete audit log
const deleteAuditLog = (req, res) => {

    const { id } = req.params;

    auditLogModel.deleteAuditLog(id, (err, result) => {

        if (err) {
            console.error("Delete Audit Log Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Audit log deleted successfully"
        });
    });
};


module.exports = {
    getAllAuditLogs,
    getAuditLogById,
    addAuditLog,
    updateAuditLog,
    deleteAuditLog
};