const {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
} = require("../models/vendorModel");


// GET all vendors
const getVendors = (req, res) => {

    getAllVendors((err, results) => {

        if (err) {
            console.error("Get Vendors Error:", err);

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


// GET vendor by ID
const getVendor = (req, res) => {

    const { id } = req.params;

    getVendorById(id, (err, results) => {

        if (err) {
            console.error("Get Vendor Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });

        }

        res.status(200).json({
            success: true,
            data: results[0]
        });

    });

};


// CREATE vendor
const addVendor = (req, res) => {

    const {
        vendor_name,
        contact_person,
        phone,
        email
    } = req.body;


    if (!vendor_name) {

        return res.status(400).json({
            success: false,
            message: "Vendor name is required"
        });

    }


    const vendor = {
        vendor_name,
        contact_person: contact_person || null,
        phone: phone || null,
        email: email || null
    };


    createVendor(vendor, (err, result) => {

        if (err) {
            console.error("Create Vendor Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            vendorId: result.insertId
        });

    });

};


// UPDATE vendor
const editVendor = (req, res) => {

    const { id } = req.params;

    const {
        vendor_name,
        contact_person,
        phone,
        email
    } = req.body;


    if (!vendor_name) {

        return res.status(400).json({
            success: false,
            message: "Vendor name is required"
        });

    }


    const vendor = {
        vendor_name,
        contact_person: contact_person || null,
        phone: phone || null,
        email: email || null
    };


    updateVendor(id, vendor, (err, result) => {

        if (err) {
            console.error("Update Vendor Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Vendor updated successfully"
        });

    });

};


// DELETE vendor
const removeVendor = (req, res) => {

    const { id } = req.params;

    deleteVendor(id, (err, result) => {

        if (err) {
            console.error("Delete Vendor Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully"
        });

    });

};


module.exports = {
    getVendors,
    getVendor,
    addVendor,
    editVendor,
    removeVendor
};