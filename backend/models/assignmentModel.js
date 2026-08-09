const db = require("../config/db");


// Get all assignments
const getAllAssignments = (callback) => {

    const sql = `
        SELECT
            id,
            asset_id,
            employee_id,
            assigned_date,
            return_date,
            status,
            created_at
        FROM assignments
        ORDER BY id DESC
    `;

    db.query(sql, callback);
};


// Get assignment by ID
const getAssignmentById = (id, callback) => {

    const sql = `
        SELECT
            id,
            asset_id,
            employee_id,
            assigned_date,
            return_date,
            status,
            created_at
        FROM assignments
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};


// Create assignment
const createAssignment = (assignment, callback) => {

    const sql = `
        INSERT INTO assignments
        (
            asset_id,
            employee_id,
            assigned_date,
            return_date,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        assignment.asset_id,
        assignment.employee_id,
        assignment.assigned_date,
        assignment.return_date || null,
        assignment.status || "Assigned"
    ];

    db.query(sql, values, callback);
};


// Update assignment
const updateAssignment = (id, assignment, callback) => {

    const sql = `
        UPDATE assignments
        SET
            asset_id = ?,
            employee_id = ?,
            assigned_date = ?,
            return_date = ?,
            status = ?
        WHERE id = ?
    `;

    const values = [
        assignment.asset_id,
        assignment.employee_id,
        assignment.assigned_date,
        assignment.return_date || null,
        assignment.status || "Assigned",
        id
    ];

    db.query(sql, values, callback);
};


// Delete assignment
const deleteAssignment = (id, callback) => {

    const sql = `
        DELETE FROM assignments
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};


module.exports = {
    getAllAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
};