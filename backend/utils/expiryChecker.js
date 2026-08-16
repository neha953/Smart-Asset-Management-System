const db = require("../config/db");
const { sendAlertEmail } = require("./emailService");

const checkExpiries = () => {

    const warrantySql = `
        SELECT w.id, a.asset_name, w.warranty_end_date
        FROM warranties w
        JOIN assets a ON w.asset_id = a.id
        WHERE w.warranty_end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    `;

    const licenseSql = `
        SELECT l.id, a.asset_name, l.expiry_date
        FROM software_licenses l
        JOIN assets a ON l.asset_id = a.id
        WHERE l.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    `;

    db.query(warrantySql, (wErr, warranties) => {

        if (wErr) { console.error(wErr); warranties = []; }

        db.query(licenseSql, (lErr, licenses) => {

            if (lErr) { console.error(lErr); licenses = []; }

            if (warranties.length === 0 && licenses.length === 0) {
                console.log("Expiry check: nothing expiring in the next 7 days.");
                return;
            }

            let html = "<h2>Assets expiring within 7 days</h2>";

            if (warranties.length) {
                html += "<h3>Warranties</h3><ul>";
                warranties.forEach(w => {
                    html += `<li>${w.asset_name} - expires ${w.warranty_end_date}</li>`;
                });
                html += "</ul>";
            }

            if (licenses.length) {
                html += "<h3>Software Licenses</h3><ul>";
                licenses.forEach(l => {
                    html += `<li>${l.asset_name} - expires ${l.expiry_date}</li>`;
                });
                html += "</ul>";
            }

            sendAlertEmail("Aegis AssetOps - Expiry Alert", html);

        });

    });

};

module.exports = { checkExpiries };