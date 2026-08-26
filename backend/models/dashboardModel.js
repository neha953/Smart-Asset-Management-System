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

    const warrantyExpirySql = `
        SELECT
            w.id,
            w.asset_id,
            a.asset_name,
            w.vendor,
            w.warranty_end_date,
            w.status
        FROM warranties w
        LEFT JOIN assets a ON w.asset_id = a.id
        WHERE w.status = 'Active'
        AND w.warranty_end_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ORDER BY w.warranty_end_date ASC
    `;

    const licenseExpirySql = `
        SELECT
            l.id,
            l.asset_id,
            a.asset_name,
            l.license_key,
            l.expiry_date,
            l.vendor,
            l.status
        FROM software_licenses l
        LEFT JOIN assets a ON l.asset_id = a.id
        WHERE l.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        AND l.expiry_date >= CURDATE()
        ORDER BY l.expiry_date ASC
    `;

    const assignmentReturnSql = `
        SELECT ag.id, a.asset_name, ag.return_date, e.full_name
        FROM assignments ag
        JOIN assets a ON ag.asset_id = a.id
        JOIN employees e ON ag.employee_id = e.id
        WHERE ag.return_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    `;

    db.query(statsSql, (err, stats) => {

        if (err) {
            return callback(err);
        }

        db.query(statusSql, (err, statusBreakdown) => {

            if (err) {
                return callback(err);
            }

            db.query(warrantyExpirySql, (err, warrantyExpiries) => {

                if (err) {
                    return callback(err);
                }

                db.query(licenseExpirySql, (err, licenseExpiries) => {

                    if (err) {
                        return callback(err);
                    }

                    db.query(assignmentReturnSql, (err, assignmentReturns) => {

                        if (err) {
                            return callback(err);
                        }

                        callback(null, {
                            stats: stats[0],
                            statusBreakdown,
                            warrantyExpiries,
                            licenseExpiries,
                            assignmentReturns
                        });

                    });

                });

            });

        });

    });
};

module.exports = {
    getDashboardStats
};