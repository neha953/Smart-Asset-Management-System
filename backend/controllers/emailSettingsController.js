const { encrypt } = require("../utils/crypto");
const { getSettings, saveSettings } = require("../models/emailSettingsModel");

const getEmailSettings = (req, res) => {

    getSettings((err, results) => {

        if (err) {
            console.error("Get Email Settings Error:", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        if (results.length === 0) {

            return res.status(200).json({
                success: true,
                data: { email_user: "", notify_admin_email: "", configured: false }
            });

        }

        res.status(200).json({
            success: true,
            data: {
                email_user: results[0].email_user,
                notify_admin_email: results[0].notify_admin_email,
                configured: true
            }
        });

    });

};

const updateEmailSettings = (req, res) => {

    const { email_user, email_pass, notify_admin_email } = req.body;

    if (!email_user || !email_pass) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const encryptedPass = encrypt(email_pass);

    saveSettings(
        {
            email_user,
            email_pass_encrypted: encryptedPass,
            notify_admin_email: notify_admin_email || email_user
        },
        (err) => {

            if (err) {
                console.error("Save Email Settings Error:", err);
                return res.status(500).json({ success: false, message: "Database Error" });
            }

            res.status(200).json({ success: true, message: "Email settings saved successfully" });

        }
    );

};

module.exports = { getEmailSettings, updateEmailSettings };