const db = require("../config/db");

// Get All Maintenance Records
const getAllMaintenance = (callback) => {
    const sql = "SELECT * FROM maintenance ORDER BY id DESC";
    db.query(sql, callback);
};

// Get Maintenance By ID
const getMaintenanceById = (id, callback) => {
    const sql = "SELECT * FROM maintenance WHERE id = ?";
    db.query(sql, [id], callback);
};

// Add Maintenance Record
const addMaintenance = (maintenance, callback) => {
    const sql = `
        INSERT INTO maintenance
        (asset_id, maintenance_date, description, status, cost)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        maintenance.asset_id,
        maintenance.maintenance_date,
        maintenance.description,
        maintenance.status,
        maintenance.cost
    ], callback);
};

// Update Maintenance Record
const updateMaintenance = (id, maintenance, callback) => {
    const sql = `
        UPDATE maintenance
        SET
            asset_id = ?,
            maintenance_date = ?,
            description = ?,
            status = ?,
            cost = ?
        WHERE id = ?
    `;

    db.query(sql, [
        maintenance.asset_id,
        maintenance.maintenance_date,
        maintenance.description,
        maintenance.status,
        maintenance.cost,
        id
    ], callback);
};

// Delete Maintenance Record
const deleteMaintenance = (id, callback) => {
    const sql = "DELETE FROM maintenance WHERE id = ?";
    db.query(sql, [id], callback);
};

module.exports = {
    getAllMaintenance,
    getMaintenanceById,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance
};