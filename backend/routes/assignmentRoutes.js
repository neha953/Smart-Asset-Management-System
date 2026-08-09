const express = require("express");

const {
    getAssignments,
    getAssignment,
    addAssignment,
    editAssignment,
    removeAssignment
} = require("../controllers/assignmentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all assignments
router.get("/", authMiddleware, getAssignments);


// Get assignment by ID
router.get("/:id", authMiddleware, getAssignment);


// Create assignment
router.post("/", authMiddleware, addAssignment);


// Update assignment
router.put("/:id", authMiddleware, editAssignment);


// Delete assignment
router.delete("/:id", authMiddleware, removeAssignment);


module.exports = router;