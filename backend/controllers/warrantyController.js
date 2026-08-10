const warrantyModel = require('../models/warrantyModel');

// Get all warranties
const getAllWarranties = (req, res) => {
    warrantyModel.getAllWarranties((err, results) => {
        if (err) {
            console.error('Error fetching warranties:', err);

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch warranties',
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
};

// Get warranty by ID
const getWarrantyById = (req, res) => {
    const { id } = req.params;

    warrantyModel.getWarrantyById(id, (err, results) => {
        if (err) {
            console.error('Error fetching warranty:', err);

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch warranty',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Warranty not found'
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};

// Create warranty
const createWarranty = (req, res) => {
    const {
        asset_id,
        warranty_start_date,
        warranty_end_date,
        vendor,
        status,
        description
    } = req.body;

    // Required field validation
    if (
        !asset_id ||
        !warranty_start_date ||
        !warranty_end_date
    ) {
        return res.status(400).json({
            success: false,
            message: 'Asset ID, warranty start date and warranty end date are required'
        });
    }

    // Date validation
    if (new Date(warranty_start_date) > new Date(warranty_end_date)) {
        return res.status(400).json({
            success: false,
            message: 'Warranty end date must be after warranty start date'
        });
    }

    const warrantyData = {
        asset_id,
        warranty_start_date,
        warranty_end_date,
        vendor,
        status,
        description
    };

    warrantyModel.createWarranty(warrantyData, (err, result) => {
        if (err) {
            console.error('Error creating warranty:', err);

            return res.status(500).json({
                success: false,
                message: 'Failed to add warranty',
                error: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: 'Warranty added successfully',
            warrantyId: result.insertId
        });
    });
};

// Update warranty
const updateWarranty = (req, res) => {
    const { id } = req.params;

    const {
        asset_id,
        warranty_start_date,
        warranty_end_date,
        vendor,
        status,
        description
    } = req.body;

    // Required field validation
    if (
        !asset_id ||
        !warranty_start_date ||
        !warranty_end_date
    ) {
        return res.status(400).json({
            success: false,
            message: 'Asset ID, warranty start date and warranty end date are required'
        });
    }

    // Date validation
    if (new Date(warranty_start_date) > new Date(warranty_end_date)) {
        return res.status(400).json({
            success: false,
            message: 'Warranty end date must be after warranty start date'
        });
    }

    const warrantyData = {
        asset_id,
        warranty_start_date,
        warranty_end_date,
        vendor,
        status,
        description
    };

    warrantyModel.updateWarranty(id, warrantyData, (err, result) => {
        if (err) {
            console.error('Error updating warranty:', err);

            return res.status(500).json({
                success: false,
                message: 'Failed to update warranty',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Warranty not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Warranty updated successfully'
        });
    });
};

// Delete warranty
const deleteWarranty = (req, res) => {
    const { id } = req.params;

    warrantyModel.deleteWarranty(id, (err, result) => {
        if (err) {
            console.error('Error deleting warranty:', err);

            return res.status(500).json({
                success: false,
                message: 'Failed to delete warranty',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Warranty not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Warranty deleted successfully'
        });
    });
};

module.exports = {
    getAllWarranties,
    getWarrantyById,
    createWarranty,
    updateWarranty,
    deleteWarranty
};