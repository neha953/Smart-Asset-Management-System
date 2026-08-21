const express = require("express");

const {
    getAssignments,
    getAssignment,
    addAssignment,
    editAssignment,
    removeAssignment
} = require("../controllers/assignmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const router = express.Router();

const canManage = authorizeRole("Admin");

router.get("/", authMiddleware, canManage, getAssignments);
router.get("/:id", authMiddleware, canManage, getAssignment);
router.post("/", authMiddleware, canManage, addAssignment);
router.put("/:id", authMiddleware, canManage, editAssignment);
router.delete("/:id", authMiddleware, canManage, removeAssignment);

module.exports = router;