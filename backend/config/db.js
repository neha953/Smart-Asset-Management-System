const mysql = require("mysql2");

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "smart_asset_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {

    if (err) {
        console.log("Database Connection Failed:", err.message);
    } else {
        console.log("Database Connected Successfully");
        connection.release();
    }

});

module.exports = db;