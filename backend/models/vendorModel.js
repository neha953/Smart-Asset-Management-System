const db = require("../config/db");


// Get all vendors
const getAllVendors = (callback) => {

    const sql = `
        SELECT
            id,
            vendor_name,
            contact_person,
            phone,
            email,
            created_at
        FROM vendors
        ORDER BY id DESC
    `;

    db.query(sql, callback);
};


// Get vendor by ID
const getVendorById = (id, callback) => {

    const sql = `
        SELECT
            id,
            vendor_name,
            contact_person,
            phone,
            email,
            created_at
        FROM vendors
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};


// Create vendor
const createVendor = (vendor, callback) => {

    const sql = `
        INSERT INTO vendors
        (
            vendor_name,
            contact_person,
            phone,
            email
        )
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        vendor.vendor_name,
        vendor.contact_person || null,
        vendor.phone || null,
        vendor.email || null
    ];

    db.query(sql, values, callback);
};


// Update vendor
const updateVendor = (id, vendor, callback) => {

    const sql = `
        UPDATE vendors
        SET
            vendor_name = ?,
            contact_person = ?,
            phone = ?,
            email = ?
        WHERE id = ?
    `;

    const values = [
        vendor.vendor_name,
        vendor.contact_person || null,
        vendor.phone || null,
        vendor.email || null,
        id
    ];

    db.query(sql, values, callback);
};


// Delete vendor
const deleteVendor = (id, callback) => {

    const sql = `
        DELETE FROM vendors
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};


module.exports = {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
};