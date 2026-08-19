const bcrypt = require("bcrypt");

const {
    findUserById,
    updateUserProfile,
    getUserPasswordHash,
    updateUserPassword
} = require("../models/userModel");


const getMyProfile = (req, res) => {

    findUserById(req.user.id, (err, results) => {

        if (err) {
            console.error("Get Profile Error:", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: results[0] });

    });

};


const updateMyProfile = (req, res) => {

    const { full_name, email } = req.body;

    if (!full_name || !email) {
        return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    updateUserProfile(req.user.id, { full_name, email }, (err) => {

        if (err) {
            console.error("Update Profile Error:", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully" });

    });

};


const changeMyPassword = (req, res) => {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    getUserPasswordHash(req.user.id, async (err, results) => {

        if (err) {
            console.error("Password Lookup Error:", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, results[0].password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        updateUserPassword(req.user.id, hashed, (updateErr) => {

            if (updateErr) {
                console.error("Password Update Error:", updateErr);
                return res.status(500).json({ success: false, message: "Database Error" });
            }

            res.status(200).json({ success: true, message: "Password changed successfully" });

        });

    });

};


module.exports = {
    getMyProfile,
    updateMyProfile,
    changeMyPassword
};