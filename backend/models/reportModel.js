const db = require("../config/db");

// Overall dashboard report
const getDashboardReport = (callback) => {

    const sql = `
        SELECT

            (SELECT COUNT(*) FROM assets) AS total_assets,

            (SELECT COUNT(*) 
             FROM assets 
             WHERE asset_status = 'Available') AS available_assets,

            (SELECT COUNT(*) 
             FROM assets 
             WHERE asset_status = 'Assigned') AS assigned_assets,

            (SELECT COUNT(*) 
             FROM assets 
             WHERE asset_status = 'Under Maintenance') AS maintenance_assets,

            (SELECT COUNT(*) FROM employees) AS total_employees,

            (SELECT COUNT(*) 
             FROM employees 
             WHERE status = 'Active') AS active_employees,

            (SELECT COUNT(*) FROM assignments) AS total_assignments,

            (SELECT COUNT(*) 
             FROM assignments 
             WHERE status = 'Assigned') AS active_assignments,

            (SELECT COUNT(*) FROM maintenance) AS total_maintenance,

            (SELECT COUNT(*) 
             FROM maintenance 
             WHERE status = 'Pending') AS pending_maintenance,

            (SELECT COUNT(*) FROM warranties) AS total_warranties,

            (SELECT COUNT(*) 
             FROM warranties 
             WHERE status = 'Active') AS active_warranties,

            (SELECT COUNT(*) FROM software_licenses) AS total_licenses,

            (SELECT COUNT(*) 
             FROM software_licenses 
             WHERE status = 'Active') AS active_licenses,

            (SELECT COALESCE(SUM(price), 0)
             FROM assets) AS total_asset_value
    `;

    db.query(sql, callback);
};


// Asset report
const getAssetReport = (callback) => {

    const sql = `
        SELECT
            asset_status,
            COUNT(*) AS total
        FROM assets
        GROUP BY asset_status
        ORDER BY total DESC
    `;

    db.query(sql, callback);
};


// Maintenance report
const getMaintenanceReport = (callback) => {

    const sql = `
        SELECT
            status,
            COUNT(*) AS total,
            COALESCE(SUM(cost), 0) AS total_cost
        FROM maintenance
        GROUP BY status
        ORDER BY total DESC
    `;

    db.query(sql, callback);
};


// Warranty report
const getWarrantyReport = (callback) => {

    const sql = `
        SELECT
            status,
            COUNT(*) AS total
        FROM warranties
        GROUP BY status
        ORDER BY total DESC
    `;

    db.query(sql, callback);
};


// Software license report
const getLicenseReport = (callback) => {

    const sql = `
        SELECT
            status,
            COUNT(*) AS total
        FROM software_licenses
        GROUP BY status
        ORDER BY total DESC
    `;

    db.query(sql, callback);
};

// Raw asset data for depreciation calculation
const getAssetsForDepreciation = (callback) => {

    const sql = `
        SELECT
            a.id,
            a.asset_name,
            a.asset_code,
            c.category_name,
            a.price,
            a.purchase_date
        FROM assets a
        LEFT JOIN categories c
            ON a.category_id = c.id
        WHERE a.price IS NOT NULL
          AND a.purchase_date IS NOT NULL
        ORDER BY a.purchase_date ASC
    `;

    db.query(sql, callback);
};

module.exports = {
    getDashboardReport,
    getAssetReport,
    getMaintenanceReport,
    getWarrantyReport,
    
    getLicenseReport,
    getAssetsForDepreciation
};