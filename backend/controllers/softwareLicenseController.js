const softwareLicenseModel = require("../models/softwareLicenseModel");

// Get all software licenses
const getAllSoftwareLicenses = (req, res) => {
    softwareLicenseModel.getAllSoftwareLicenses((err, results) => {

        if (err) {
            console.error("Get Software Licenses Error:", err);

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


// Get software license by ID
const getSoftwareLicenseById = (req, res) => {
    const { id } = req.params;

    softwareLicenseModel.getSoftwareLicenseById(id, (err, results) => {

        if (err) {
            console.error("Get Software License By ID Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Software license not found"
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};


// Add software license
const addSoftwareLicense = (req, res) => {

    const {
        asset_id,
        license_key,
        expiry_date,
        vendor,
        status
    } = req.body;

    if (!asset_id || !license_key || !expiry_date) {
        return res.status(400).json({
            success: false,
            message: "Asset ID, license key and expiry date are required"
        });
    }

    const license = {
        asset_id,
        license_key,
        expiry_date,
        vendor,
        status
    };

    softwareLicenseModel.addSoftwareLicense(license, (err, result) => {

        if (err) {
            console.error("Add Software License Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(201).json({
            success: true,
            message: "Software license added successfully",
            licenseId: result.insertId
        });
    });
};


// Update software license
const updateSoftwareLicense = (req, res) => {

    const { id } = req.params;

    const {
        asset_id,
        license_key,
        expiry_date,
        vendor,
        status
    } = req.body;

    const license = {
        asset_id,
        license_key,
        expiry_date,
        vendor,
        status
    };

    softwareLicenseModel.updateSoftwareLicense(id, license, (err, result) => {

        if (err) {
            console.error("Update Software License Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Software license not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Software license updated successfully"
        });
    });
};


// Delete software license
const deleteSoftwareLicense = (req, res) => {

    const { id } = req.params;

    softwareLicenseModel.deleteSoftwareLicense(id, (err, result) => {

        if (err) {
            console.error("Delete Software License Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Software license not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Software license deleted successfully"
        });
    });
};


module.exports = {
    getAllSoftwareLicenses,
    getSoftwareLicenseById,
    addSoftwareLicense,
    updateSoftwareLicense,
    deleteSoftwareLicense
};