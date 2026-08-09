const {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
} = require("../models/assetModel");


// GET all assets
const getAssets = (req, res) => {

    getAllAssets((err, results) => {

        if (err) {
            console.error("Get Assets Error:", err);

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


// GET asset by ID
const getAsset = (req, res) => {

    const { id } = req.params;

    getAssetById(id, (err, results) => {

        if (err) {
            console.error("Get Asset Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });

        }

        res.status(200).json({
            success: true,
            data: results[0]
        });

    });

};


// CREATE asset
const addAsset = (req, res) => {

    const {
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
    } = req.body;


    if (
        !asset_name ||
        !asset_code ||
        !category_id ||
        !vendor_id ||
        !purchase_date ||
        !warranty_expiry ||
        !asset_status ||
        !location ||
        price === undefined
    ) {

        return res.status(400).json({
            success: false,
            message: "All required asset fields are required"
        });

    }


    const asset = {
        asset_name,
        asset_code,
        category_id,
        vendor_id,
        purchase_date,
        warranty_expiry,
        asset_status,
        location,
        price,
        qr_code: qr_code || null
    };


    createAsset(asset, (err, result) => {

        if (err) {
            console.error("Create Asset Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(201).json({
            success: true,
            message: "Asset created successfully",
            assetId: result.insertId
        });

    });

};


// UPDATE asset
const editAsset = (req, res) => {

    const { id } = req.params;

    const {
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
    } = req.body;


    if (
        !asset_name ||
        !asset_code ||
        !category_id ||
        !vendor_id ||
        !purchase_date ||
        !warranty_expiry ||
        !asset_status ||
        !location ||
        price === undefined
    ) {

        return res.status(400).json({
            success: false,
            message: "All required asset fields are required"
        });

    }


    const asset = {
        asset_name,
        asset_code,
        category_id,
        vendor_id,
        purchase_date,
        warranty_expiry,
        asset_status,
        location,
        price,
        qr_code: qr_code || null
    };


    updateAsset(id, asset, (err, result) => {

        if (err) {
            console.error("Update Asset Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Asset updated successfully"
        });

    });

};


// DELETE asset
const removeAsset = (req, res) => {

    const { id } = req.params;

    deleteAsset(id, (err, result) => {

        if (err) {
            console.error("Delete Asset Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Asset deleted successfully"
        });

    });

};


module.exports = {
    getAssets,
    getAsset,
    addAsset,
    editAsset,
    removeAsset
};