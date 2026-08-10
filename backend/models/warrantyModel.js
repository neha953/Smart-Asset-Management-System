const db = require('../config/db');

// Get all warranties
const getAllWarranties = (callback) => {
    const sql = `
        SELECT 
            w.id,
            w.asset_id,
            w.warranty_start_date,
            w.warranty_end_date,
            w.vendor,
            w.status,
            w.description,
            w.created_at
        FROM warranties w
        ORDER BY w.id DESC
    `;

    db.query(sql, callback);
};

// Get warranty by ID
const getWarrantyById = (id, callback) => {
    const sql = `
        SELECT 
            w.id,
            w.asset_id,
            w.warranty_start_date,
            w.warranty_end_date,
            w.vendor,
            w.status,
            w.description,
            w.created_at
        FROM warranties w
        WHERE w.id = ?
    `;

    db.query(sql, [id], callback);
};

// Create warranty
const createWarranty = (warrantyData, callback) => {
    const {
        asset_id,
        warranty_start_date,
        warranty_end_date,
        vendor,
        status,
        description
    } = warrantyData;

    const sql = `
        INSERT INTO warranties
        (
            asset_id,
            warranty_start_date,
            warranty_end_date,
            vendor,
            status,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            asset_id,
            warranty_start_date,
            warranty_end_date,
            vendor,
            status || 'Active',
            description
        ],
        callback
    );
};

// Update warranty
const updateWarranty = (id, warrantyData, callback) => {
    const {
        asset_id,
        warranty_start_date,
        warranty_end_date,
        vendor,
        status,
        description
    } = warrantyData;

    const sql = `
        UPDATE warranties
        SET
            asset_id = ?,
            warranty_start_date = ?,
            warranty_end_date = ?,
            vendor = ?,
            status = ?,
            description = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            asset_id,
            warranty_start_date,
            warranty_end_date,
            vendor,
            status,
            description,
            id
        ],
        callback
    );
};

// Delete warranty
const deleteWarranty = (id, callback) => {
    const sql = `
        DELETE FROM warranties
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};

module.exports = {
    getAllWarranties,
    getWarrantyById,
    createWarranty,
    updateWarranty,
    deleteWarranty
};