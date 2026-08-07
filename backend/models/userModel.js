const db = require("../config/db");

const findUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM Users WHERE email = ?";

    db.query(sql, [email], callback);
};

module.exports = {
    findUserByEmail
};