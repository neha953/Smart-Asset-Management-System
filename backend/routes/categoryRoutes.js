const express = require("express");

const {
    getCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all categories
router.get("/", authMiddleware, getCategories);


// Get category by ID
router.get("/:id", authMiddleware, getCategory);


// Create category
router.post("/", authMiddleware, addCategory);


// Update category
router.put("/:id", authMiddleware, editCategory);


// Delete category
router.delete("/:id", authMiddleware, removeCategory);


module.exports = router;