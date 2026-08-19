const db = require("../config/db");

const findUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM Users WHERE email = ?";
    db.query(sql, [email], callback);
};

const findUserById = (id, callback) => {
    const sql = "SELECT id, full_name, email, role, created_at FROM Users WHERE id = ?";
    db.query(sql, [id], callback);
};

const updateUserProfile = (id, { full_name, email }, callback) => {
    const sql = "UPDATE Users SET full_name = ?, email = ? WHERE id = ?";
    db.query(sql, [full_name, email, id], callback);
};

const getUserPasswordHash = (id, callback) => {
    const sql = "SELECT password FROM Users WHERE id = ?";
    db.query(sql, [id], callback);
};

const updateUserPassword = (id, hashedPassword, callback) => {
    const sql = "UPDATE Users SET password = ? WHERE id = ?";
    db.query(sql, [hashedPassword, id], callback);
};

module.exports = {
    findUserByEmail,
    findUserById,
    updateUserProfile,
    getUserPasswordHash,
    updateUserPassword
};