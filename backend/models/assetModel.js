const db = require("../config/db");


// Get all assets
const getAllAssets = (callback) => {

    const sql = `
        SELECT
            a.id,
            a.asset_name,
            a.asset_code,
            a.category_id,
            a.vendor_id,
            a.purchase_date,
            a.warranty_expiry,
            a.asset_status,
            a.location,
            a.price,
            a.qr_code,
            a.created_at
        FROM assets a
        ORDER BY a.id DESC
    `;

    db.query(sql, callback);
};


// Get single asset
const getAssetById = (id, callback) => {

    const sql = `
        SELECT
            id,
            asset_name,
            asset_code,
            category_id,
            vendor_id,
            purchase_date,
            warranty_expiry,
            asset_status,
            location,
            price,
            qr_code,
            created_at
        FROM assets
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};


// Create asset
const createAsset = (asset, callback) => {

    const sql = `
        INSERT INTO assets
        (
            asset_name,
            asset_code,
            category_id,
            vendor_id,
            purchase_date,
            warranty_expiry,
            asset_status,
            location,
            price,
            qr_code
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        asset.asset_name,
        asset.asset_code,
        asset.category_id,
        asset.vendor_id,
        asset.purchase_date,
        asset.warranty_expiry,
        asset.asset_status,
        asset.location,
        asset.price,
        asset.qr_code
    ];

    db.query(sql, values, callback);
};


// Update asset
const updateAsset = (id, asset, callback) => {

    const sql = `
        UPDATE assets
        SET
            asset_name = ?,
            asset_code = ?,
            category_id = ?,
            vendor_id = ?,
            purchase_date = ?,
            warranty_expiry = ?,
            asset_status = ?,
            location = ?,
            price = ?,
            qr_code = ?
        WHERE id = ?
    `;

    const values = [
        asset.asset_name,
        asset.asset_code,
        asset.category_id,
        asset.vendor_id,
        asset.purchase_date,
        asset.warranty_expiry,
        asset.asset_status,
        asset.location,
        asset.price,
        asset.qr_code,
        id
    ];

    db.query(sql, values, callback);
};


// Delete asset
const deleteAsset = (id, callback) => {

    const sql = `
        DELETE FROM assets
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};


module.exports = {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};