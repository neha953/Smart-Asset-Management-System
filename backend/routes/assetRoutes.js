const express = require("express");

const {
    getAssets,
    getAsset,
    addAsset,
    editAsset,
    bulkImportAssets,
    removeAsset
} = require("../controllers/assetController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all assets
router.get(
    "/",
    verifyToken,
    authorizeRole("Admin"),
    getAssets
);

// Get single asset
router.get(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    getAsset
);
router.post("/bulk-import", verifyToken, authorizeRole("Admin"), bulkImportAssets);
// Create asset
router.post(
    "/",
    verifyToken,
    authorizeRole("Admin"),
    addAsset
);

// Update asset
router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    editAsset
);

// Delete asset
router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    removeAsset
);

module.exports = router;