const reportModel = require("../models/reportModel");


// Get overall dashboard report
const getDashboardReport = (req, res) => {

    reportModel.getDashboardReport((err, results) => {

        if (err) {

            console.error(
                "Get Dashboard Report Error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });

    });
};


// Get asset report
const getAssetReport = (req, res) => {

    reportModel.getAssetReport((err, results) => {

        if (err) {

            console.error(
                "Get Asset Report Error:",
                err
            );

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


// Get maintenance report
const getMaintenanceReport = (req, res) => {

    reportModel.getMaintenanceReport((err, results) => {

        if (err) {

            console.error(
                "Get Maintenance Report Error:",
                err
            );

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


// Get warranty report
const getWarrantyReport = (req, res) => {

    reportModel.getWarrantyReport((err, results) => {

        if (err) {

            console.error(
                "Get Warranty Report Error:",
                err
            );

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


// Get software license report
const getLicenseReport = (req, res) => {

    reportModel.getLicenseReport((err, results) => {

        if (err) {

            console.error(
                "Get License Report Error:",
                err
            );

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


module.exports = {
    getDashboardReport,
    getAssetReport,
    getMaintenanceReport,
    getWarrantyReport,
    getLicenseReport
};