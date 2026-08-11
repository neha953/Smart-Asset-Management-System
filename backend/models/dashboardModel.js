const db = require("../config/db");

const getDashboardStats = (callback) => {

    const statsSql = `
        SELECT
            (SELECT COUNT(*) FROM assets) AS total_assets,
            (SELECT COUNT(*) FROM assets WHERE asset_status = 'Available') AS available_assets,
            (SELECT COUNT(*) FROM assets WHERE asset_status = 'Assigned') AS assigned_assets,
            (SELECT COUNT(*) FROM assets WHERE asset_status = 'Maintenance') AS maintenance_assets,
            (SELECT COUNT(*) FROM employees) AS total_employees,
            (SELECT COUNT(*) FROM vendors) AS total_vendors,
            (SELECT COUNT(*) FROM categories) AS total_categories,
            (SELECT COUNT(*) FROM warranties) AS total_warranties,
            (SELECT COUNT(*) FROM software_licenses) AS total_licenses
    `;

    const statusSql = `
        SELECT
            asset_status,
            COUNT(*) AS count
        FROM assets
        GROUP BY asset_status
        ORDER BY count DESC
    `;

    db.query(statsSql, (err, stats) => {

        if (err) {
            return callback(err);
        }

        db.query(statusSql, (err, statusBreakdown) => {

            if (err) {
                return callback(err);
            }

            callback(null, {
                stats: stats[0],
                statusBreakdown
            });

        });

    });
};

module.exports = {
    getDashboardStats
};