const { getDashboardStats } = require("../models/dashboardModel");

const getDashboard = (req, res) => {

    getDashboardStats((err, results) => {

        if (err) {
            console.error("Dashboard Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch dashboard statistics"
            });
        }

        res.status(200).json({
            success: true,
            data: results.stats,
            assetStatusBreakdown: results.statusBreakdown,
            warrantyExpiries: results.warrantyExpiries,
            licenseExpiries: results.licenseExpiries,
            assignmentReturns: results.assignmentReturns
        });

    });

};

module.exports = {
    getDashboard
};