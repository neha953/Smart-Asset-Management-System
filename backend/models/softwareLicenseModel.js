const db = require("../config/db");

// Get All Software Licenses
const getAllSoftwareLicenses = (callback) => {
    const sql = "SELECT * FROM software_licenses ORDER BY id DESC";
    db.query(sql, callback);
};

// Get Software License By ID
const getSoftwareLicenseById = (id, callback) => {
    const sql = "SELECT * FROM software_licenses WHERE id = ?";
    db.query(sql, [id], callback);
};

// Add Software License
const addSoftwareLicense = (license, callback) => {
    const sql = `
        INSERT INTO software_licenses
        (asset_id, license_key, expiry_date, vendor, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        license.asset_id,
        license.license_key,
        license.expiry_date,
        license.vendor,
        license.status
    ], callback);
};

// Update Software License
const updateSoftwareLicense = (id, license, callback) => {
    const sql = `
        UPDATE software_licenses
        SET
            asset_id = ?,
            license_key = ?,
            expiry_date = ?,
            vendor = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(sql, [
        license.asset_id,
        license.license_key,
        license.expiry_date,
        license.vendor,
        license.status,
        id
    ], callback);
};

// Delete Software License
const deleteSoftwareLicense = (id, callback) => {
    const sql = "DELETE FROM software_licenses WHERE id = ?";
    db.query(sql, [id], callback);
};

module.exports = {
    getAllSoftwareLicenses,
    getSoftwareLicenseById,
    addSoftwareLicense,
    updateSoftwareLicense,
    deleteSoftwareLicense
};