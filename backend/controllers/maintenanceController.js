const maintenanceModel = require("../models/maintenanceModel");

// Get all maintenance records
const getAllMaintenance = (req, res) => {

    maintenanceModel.getAllMaintenance((err, results) => {

        if (err) {
            console.error("Get Maintenance Error:", err);

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


// Get maintenance record by ID
const getMaintenanceById = (req, res) => {

    const { id } = req.params;

    maintenanceModel.getMaintenanceById(id, (err, results) => {

        if (err) {
            console.error("Get Maintenance By ID Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};


// Add maintenance record
const addMaintenance = (req, res) => {

    const {
        asset_id,
        maintenance_date,
        description,
        status,
        cost
    } = req.body;

    if (!asset_id || !maintenance_date) {
        return res.status(400).json({
            success: false,
            message: "Asset ID and maintenance date are required"
        });
    }

    const maintenance = {
        asset_id,
        maintenance_date,
        description,
        status,
        cost
    };

    maintenanceModel.addMaintenance(maintenance, (err, result) => {

        if (err) {
            console.error("Add Maintenance Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(201).json({
            success: true,
            message: "Maintenance record added successfully",
            maintenanceId: result.insertId
        });
    });
};


// Update maintenance record
const updateMaintenance = (req, res) => {

    const { id } = req.params;

    const {
        asset_id,
        maintenance_date,
        description,
        status,
        cost
    } = req.body;

    const maintenance = {
        asset_id,
        maintenance_date,
        description,
        status,
        cost
    };

    maintenanceModel.updateMaintenance(id, maintenance, (err, result) => {

        if (err) {
            console.error("Update Maintenance Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Maintenance record updated successfully"
        });
    });
};


// Delete maintenance record
const deleteMaintenance = (req, res) => {

    const { id } = req.params;

    maintenanceModel.deleteMaintenance(id, (err, result) => {

        if (err) {
            console.error("Delete Maintenance Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Maintenance record deleted successfully"
        });
    });
};


module.exports = {
    getAllMaintenance,
    getMaintenanceById,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance
};