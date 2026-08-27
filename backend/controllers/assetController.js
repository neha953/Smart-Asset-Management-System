const QRCode = require("qrcode");
const { logAudit } = require("../utils/auditLogger");
const bulkImportAssets = (req, res) => {

    const { assets } = req.body;

    if (!Array.isArray(assets) || assets.length === 0) {
        return res.status(400).json({ success: false, message: "No asset rows provided" });
    }

    let successCount = 0;
    let failed = [];
    let processed = 0;

    assets.forEach((row, index) => {

        const assetUrl = `${process.env.APP_BASE_URL || "http://localhost:5000"}/assets.html?code=${encodeURIComponent(row.asset_code)}`;

        QRCode.toDataURL(assetUrl, (qrErr, qrDataUrl) => {

            const asset = {
                asset_name: row.asset_name,
                asset_code: row.asset_code,
                category_id: row.category_id,
                vendor_id: row.vendor_id,
                purchase_date: row.purchase_date,
                warranty_expiry: row.warranty_expiry,
                asset_status: row.asset_status || "Available",
                location: row.location,
                price: row.price,
                qr_code: qrErr ? "" : qrDataUrl
            };

            createAsset(asset, (err) => {

                processed++;

                if (err) {
                    failed.push({ row: index + 1, asset_code: row.asset_code, reason: err.code === "ER_DUP_ENTRY" ? "Duplicate asset code" : "Database error" });
                } else {
                    successCount++;
                    logAudit(req.user.id, "assets", `Bulk imported asset: ${row.asset_name} (${row.asset_code})`);
                }

                if (processed === assets.length) {

                    res.status(200).json({
                        success: true,
                        message: `Imported ${successCount} of ${assets.length} assets`,
                        successCount,
                        failedCount: failed.length,
                        failed
                    });

                }

            });

        });

    });

};

const {
    getAllAssets,
    getAssetById,
    getAssetByCode,
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


// GET asset by asset_code (used when a QR code is scanned)
const scanAsset = (req, res) => {

    const { code } = req.params;

    getAssetByCode(code, (err, results) => {

        if (err) {
            console.error("Scan Asset Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "No asset found for this QR code"
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
        price
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


    // Auto-generate a real, scannable QR code from the asset_code.
    const assetUrl = `${process.env.APP_BASE_URL || "http://localhost:5000"}/assets.html?code=${encodeURIComponent(asset_code)}`;

    QRCode.toDataURL(assetUrl, (qrErr, qrDataUrl) => {

        if (qrErr) {
            console.error("QR Generate Error:", qrErr);

            return res.status(500).json({
                success: false,
                message: "Failed to generate QR code"
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
            qr_code: qrDataUrl
        };

        createAsset(asset, (err, result) => {

            if (err) {
                console.error("Create Asset Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }
             logAudit(req.user.id, "assets", `Created asset: ${asset_name} (${asset_code})`);
            res.status(201).json({
                success: true,
                message: "Asset created successfully",
                assetId: result.insertId
            });

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
        price
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


    getAssetById(id, (fetchErr, existing) => {

        const oldStatus = existing && existing[0] ? existing[0].asset_status : null;

        // Regenerate the QR code too, in case asset_code was edited
        const assetUrl = `${process.env.APP_BASE_URL || "http://localhost:5000"}/assets.html?code=${encodeURIComponent(asset_code)}`;

        QRCode.toDataURL(assetUrl, (qrErr, qrDataUrl) => {

            if (qrErr) {
                console.error("QR Generate Error:", qrErr);

                return res.status(500).json({
                    success: false,
                    message: "Failed to generate QR code"
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
                qr_code: qrDataUrl
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

                logAudit(req.user.id, "assets", `Updated asset: ${asset_name} (${asset_code})`);

                if (oldStatus && oldStatus !== asset_status) {
                    logAudit(req.user.id, "assets", `Status changed for ${asset_name} (${asset_code}): ${oldStatus} -> ${asset_status}`);
                }

                res.status(200).json({
                    success: true,
                    message: "Asset updated successfully"
                });

            });

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

        logAudit(req.user.id, "assets", `Deleted asset ID: ${id}`);
        res.status(200).json({
            success: true,
            message: "Asset deleted successfully"
        });

    });

};


module.exports = {
    getAssets,
    getAsset,
    scanAsset,
    addAsset,
    editAsset,
    bulkImportAssets,
    removeAsset
};
