const express = require("express");

const {
    getVendors,
    getVendor,
    addVendor,
    editVendor,
    removeVendor
} = require("../controllers/vendorController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all vendors
router.get("/", authMiddleware, getVendors);


// Get vendor by ID
router.get("/:id", authMiddleware, getVendor);


// Create vendor
router.post("/", authMiddleware, addVendor);


// Update vendor
router.put("/:id", authMiddleware, editVendor);


// Delete vendor
router.delete("/:id", authMiddleware, removeVendor);


module.exports = router;