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

// Get depreciation report (straight-line method)
// Assumptions: 5-year useful life, 10% salvage value
const getDepreciationReport = (req, res) => {

    const usefulLifeYears =
        Number(req.query.usefulLifeYears) || 5;

    const salvagePercent =
        Number(req.query.salvagePercent) || 0.10;

    reportModel.getAssetsForDepreciation((err, assets) => {

        if (err) {

            console.error("Get Depreciation Report Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        const today = new Date();

        const results = assets.map(asset => {

            const price = Number(asset.price) || 0;
            const purchaseDate = new Date(asset.purchase_date);

            const salvageValue = price * salvagePercent;

            const annualDepreciation =
                (price - salvageValue) / usefulLifeYears;

            const yearsUsed =
                Math.max(
                    (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365),
                    0
                );

            const accumulatedDepreciation =
                Math.min(
                    annualDepreciation * yearsUsed,
                    price - salvageValue
                );

            const currentValue =
                Math.max(
                    price - accumulatedDepreciation,
                    salvageValue
                );

            return {
                id: asset.id,
                asset_name: asset.asset_name,
                asset_code: asset.asset_code,
                category_name: asset.category_name,
                purchase_date: asset.purchase_date,
                original_price: Number(price.toFixed(2)),
                years_used: Number(yearsUsed.toFixed(2)),
                annual_depreciation: Number(annualDepreciation.toFixed(2)),
                accumulated_depreciation: Number(accumulatedDepreciation.toFixed(2)),
                current_value: Number(currentValue.toFixed(2))
            };

        });

        const totals = results.reduce(
            (acc, r) => {
                acc.total_original_value += r.original_price;
                acc.total_current_value += r.current_value;
                acc.total_depreciation += r.accumulated_depreciation;
                return acc;
            },
            { total_original_value: 0, total_current_value: 0, total_depreciation: 0 }
        );

        res.status(200).json({
            success: true,
            assumptions: { usefulLifeYears, salvagePercent },
            totals: {
                total_original_value: Number(totals.total_original_value.toFixed(2)),
                total_current_value: Number(totals.total_current_value.toFixed(2)),
                total_depreciation: Number(totals.total_depreciation.toFixed(2))
            },
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
    getLicenseReport,
    getDepreciationReport
};