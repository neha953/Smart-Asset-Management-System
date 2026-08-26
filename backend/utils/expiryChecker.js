const db = require("../config/db");
const { sendAlertEmail } = require("./emailService");
const { getSettings } = require("../models/emailSettingsModel");

const checkExpiries = () => {

    const warrantySql = `
        SELECT w.id, a.id AS asset_id, a.asset_name, w.warranty_end_date
        FROM warranties w
        JOIN assets a ON w.asset_id = a.id
        WHERE w.warranty_end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    `;

    const licenseSql = `
        SELECT l.id, a.id AS asset_id, a.asset_name, l.expiry_date
        FROM software_licenses l
        JOIN assets a ON l.asset_id = a.id
        WHERE l.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    `;

    const assignmentReturnSql = `
        SELECT ag.id, a.asset_name, ag.return_date, e.full_name, e.email
        FROM assignments ag
        JOIN assets a ON ag.asset_id = a.id
        JOIN employees e ON ag.employee_id = e.id
        WHERE ag.return_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    `;

    const currentHolderSql = `
        SELECT e.full_name, e.email
        FROM assignments ag
        JOIN employees e ON ag.employee_id = e.id
        WHERE ag.asset_id = ? AND (ag.return_date IS NULL OR ag.return_date >= CURDATE())
        ORDER BY ag.assigned_date DESC
        LIMIT 1
    `;

    // ---------- Warranty & License expiry alerts ----------

    db.query(warrantySql, (wErr, warranties) => {

        if (wErr) { console.error(wErr); warranties = []; }

        db.query(licenseSql, (lErr, licenses) => {

            if (lErr) { console.error(lErr); licenses = []; }

            const items = [
                ...warranties.map(w => ({ ...w, type: "Warranty", expiry: w.warranty_end_date })),
                ...licenses.map(l => ({ ...l, type: "Software License", expiry: l.expiry_date }))
            ];

            if (items.length === 0) {
                console.log("Expiry check: nothing expiring in the next 7 days.");
            } else {

                getSettings((settingsErr, settingsResults) => {

                    const adminEmail =
                        (!settingsErr && settingsResults.length > 0)
                            ? settingsResults[0].notify_admin_email
                            : null;

                    items.forEach(item => {

                        db.query(currentHolderSql, [item.asset_id], (holderErr, holderResults) => {

                            const html = `
                                <h2>Asset Expiry Alert</h2>
                                <p><strong>${item.asset_name}</strong> - ${item.type} expires on ${item.expiry}</p>
                            `;

                            if (!holderErr && holderResults.length > 0 && holderResults[0].email) {

                                sendAlertEmail(
                                    holderResults[0].email,
                                    `Aegis AssetOps - ${item.type} Expiring Soon`,
                                    html + `<p>This asset is currently assigned to you. Please contact IT if renewal or return is needed.</p>`
                                );

                            }

                            if (adminEmail) {

                                sendAlertEmail(
                                    adminEmail,
                                    `Aegis AssetOps - ${item.type} Expiring Soon`,
                                    html
                                );

                            }

                        });

                    });

                });

            }

        });

    });

    // ---------- Assignment return-date alerts ----------

    db.query(assignmentReturnSql, (arErr, returns) => {

        if (arErr) { console.error(arErr); return; }

        if (returns.length === 0) {
            console.log("Return date check: no returns due in the next 7 days.");
            return;
        }

        getSettings((settingsErr, settingsResults) => {

            const adminEmail =
                (!settingsErr && settingsResults.length > 0)
                    ? settingsResults[0].notify_admin_email
                    : null;

            returns.forEach(r => {

                const html = `
                    <h2>Asset Return Reminder</h2>
                    <p><strong>${r.asset_name}</strong> is due to be returned on ${r.return_date}.</p>
                `;

                if (r.email) {
                    sendAlertEmail(
                        r.email,
                        "Aegis AssetOps - Asset Return Reminder",
                        html + `<p>Please return this asset by the due date, or contact IT to extend the assignment.</p>`
                    );
                }

                if (adminEmail) {
                    sendAlertEmail(adminEmail, "Aegis AssetOps - Asset Return Reminder", html);
                }

            });

        });

    });

};

module.exports = { checkExpiries };