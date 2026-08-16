const nodemailer = require("nodemailer");

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {

    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

}

const sendAlertEmail = async (subject, htmlBody) => {

    if (!transporter) {

        console.log("EMAIL NOT CONFIGURED - alert not sent:", subject);
        return { sent: false, reason: "Email not configured" };

    }

    try {

        await transporter.sendMail({
            from: `"Aegis AssetOps" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            subject,
            html: htmlBody
        });

        console.log("Alert email sent:", subject);
        return { sent: true };

    } catch (error) {

        console.error("Email send failed:", error.message);
        return { sent: false, reason: error.message };

    }

};

module.exports = { sendAlertEmail };