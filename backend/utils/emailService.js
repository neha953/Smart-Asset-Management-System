const nodemailer = require("nodemailer");
const { decrypt } = require("./crypto");
const { getSettings } = require("../models/emailSettingsModel");

const sendAlertEmail = (toAddress, subject, htmlBody) => {

    return new Promise((resolve) => {

        getSettings((err, results) => {

            if (err || results.length === 0) {

                console.log("EMAIL NOT CONFIGURED - alert not sent:", subject);
                return resolve({ sent: false, reason: "Email not configured" });

            }

            const settings = results[0];

            let password;

            try {
                password = decrypt(settings.email_pass_encrypted);
            } catch (decryptErr) {
                console.error("Email password decrypt failed:", decryptErr.message);
                return resolve({ sent: false, reason: "Decryption failed" });
            }

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: settings.email_user,
                    pass: password
                }
            });

            transporter.sendMail(
                {
                    from: `"Aegis AssetOps" <${settings.email_user}>`,
                    to: toAddress,
                    subject,
                    html: htmlBody
                },
                (sendErr) => {

                    if (sendErr) {
                        console.error("Email send failed:", sendErr.message);
                        return resolve({ sent: false, reason: sendErr.message });
                    }

                    console.log("Alert email sent to:", toAddress, "-", subject);
                    resolve({ sent: true });

                }
            );

        });

    });

};

module.exports = { sendAlertEmail };