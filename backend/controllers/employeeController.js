const {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
} = require("../models/employeeModel");

// Get All Employees
const getEmployees = (req, res) => {

    getAllEmployees((err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch employees"
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    });

};

// Get Employee By ID
const getEmployee = (req, res) => {

    const id = req.params.id;

    getEmployeeById(id, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });

    });

};

// Add Employee
const createEmployee = (req, res) => {

    addEmployee(req.body, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to add employee"
            });
        }

        res.status(201).json({
            success: true,
            message: "Employee added successfully"
        });

    });

};

// Update Employee
const editEmployee = (req, res) => {

    const id = req.params.id;

    updateEmployee(id, req.body, (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to update employee"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee updated successfully"
        });

    });

};

// Delete Employee
const removeEmployee = (req, res) => {

    const id = req.params.id;

    deleteEmployee(id, (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete employee"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    });

};

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    editEmployee,
    removeEmployee
};