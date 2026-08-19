const { addAuditLog } = require("../models/auditLogModel");

// Call this from any controller after a successful create/update/delete
// to automatically record it in the audit trail.
const logAudit = (userId, tableName, action) => {

    addAuditLog(
        { user_id: userId, action, table_name: tableName },
        (err) => {
            if (err) {
                console.error("Audit log failed:", err.message);
            }
        }
    );

};

module.exports = { logAudit };