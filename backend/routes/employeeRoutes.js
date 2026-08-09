const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getEmployees,
    getEmployee,
    createEmployee,
    editEmployee,
    removeEmployee
} = require("../controllers/employeeController");

// Get All Employees
router.get("/", verifyToken, authorizeRole("Admin"), getEmployees);

// Get Employee By ID
router.get("/:id", verifyToken, authorizeRole("Admin"), getEmployee);

// Add Employee
router.post("/", verifyToken, authorizeRole("Admin"), createEmployee);

// Update Employee
router.put("/:id", verifyToken, authorizeRole("Admin"), editEmployee);

// Delete Employee
router.delete("/:id", verifyToken, authorizeRole("Admin"), removeEmployee);

module.exports = router;