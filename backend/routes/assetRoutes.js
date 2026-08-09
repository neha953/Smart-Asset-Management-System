const express = require("express");

const {
    getAssets,
    getAsset,
    addAsset,
    editAsset,
    removeAsset
} = require("../controllers/assetController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all assets
router.get("/", authMiddleware, getAssets);


// Get single asset
router.get("/:id", authMiddleware, getAsset);


// Create asset
router.post("/", authMiddleware, addAsset);


// Update asset
router.put("/:id", authMiddleware, editAsset);


// Delete asset
router.delete("/:id", authMiddleware, removeAsset);


module.exports = router;