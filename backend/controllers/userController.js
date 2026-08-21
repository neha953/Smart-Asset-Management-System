const bcrypt = require("bcrypt");

const {
    findUserById,
    updateUserProfile,
    getUserPasswordHash,
    updateUserPassword,
    getAllUsers,
    createUser,
    deleteUser
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


const listUsers = (req, res) => {

    getAllUsers((err, results) => {

        if (err) {
            console.error("List Users Error:", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        res.status(200).json({ success: true, data: results });

    });

};


const addUser = async (req, res) => {

    const { full_name, email, password, role } = req.body;

    const validRoles = ["Admin", "SubAdmin", "ReportViewer", "Reader"];

    if (!full_name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    try {

        const hashed = await bcrypt.hash(password, 10);

        createUser({ full_name, email, password: hashed, role }, (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ success: false, message: "Email already exists" });
                }

                console.error("Add User Error:", err);
                return res.status(500).json({ success: false, message: "Database Error" });
            }

            res.status(201).json({ success: true, message: "User created successfully", userId: result.insertId });

        });

    } catch (error) {

        console.error("Add User Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

};


const removeUser = (req, res) => {

    const { id } = req.params;

    if (Number(id) === Number(req.user.id)) {
        return res.status(400).json({ success: false, message: "You cannot delete your own account" });
    }

    deleteUser(id, (err, result) => {

        if (err) {
            console.error("Delete User Error:", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });

    });

};


module.exports = {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    listUsers,
    addUser,
    removeUser
};