const db = require("../config/db");

const getSettings = (callback) => {
    db.query("SELECT * FROM email_settings ORDER BY id DESC LIMIT 1", callback);
};

const saveSettings = ({ email_user, email_pass_encrypted, notify_admin_email }, callback) => {

    getSettings((err, results) => {

        if (err) return callback(err);

        if (results.length === 0) {

            const sql = `
                INSERT INTO email_settings (email_user, email_pass_encrypted, notify_admin_email)
                VALUES (?, ?, ?)
            `;

            db.query(sql, [email_user, email_pass_encrypted, notify_admin_email], callback);

        } else {

            const sql = `
                UPDATE email_settings
                SET email_user = ?, email_pass_encrypted = ?, notify_admin_email = ?
                WHERE id = ?
            `;

            db.query(sql, [email_user, email_pass_encrypted, notify_admin_email, results[0].id], callback);

        }

    });

};

module.exports = { getSettings, saveSettings };