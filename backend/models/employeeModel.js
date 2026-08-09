const db = require("../config/db");

// Get All Employees
const getAllEmployees = (callback) => {
    const sql = "SELECT * FROM employees ORDER BY id DESC";
    db.query(sql, callback);
};

// Get Employee By ID
const getEmployeeById = (id, callback) => {
    const sql = "SELECT * FROM employees WHERE id = ?";
    db.query(sql, [id], callback);
};

// Add Employee
const addEmployee = (employee, callback) => {

    const sql = `
        INSERT INTO employees
        (full_name, email, department, designation, phone, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        employee.full_name,
        employee.email,
        employee.department,
        employee.designation,
        employee.phone,
        employee.status
    ], callback);
};

// Update Employee
const updateEmployee = (id, employee, callback) => {

    const sql = `
        UPDATE employees
        SET
        full_name = ?,
        email = ?,
        department = ?,
        designation = ?,
        phone = ?,
        status = ?
        WHERE id = ?
    `;

    db.query(sql, [
        employee.full_name,
        employee.email,
        employee.department,
        employee.designation,
        employee.phone,
        employee.status,
        id
    ], callback);
};

// Delete Employee
const deleteEmployee = (id, callback) => {

    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [id], callback);
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
};