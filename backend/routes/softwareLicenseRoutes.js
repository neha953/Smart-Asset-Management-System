const express = require("express");

const router = express.Router();

const {
    getAllSoftwareLicenses,
    getSoftwareLicenseById,
    addSoftwareLicense,
    updateSoftwareLicense,
    deleteSoftwareLicense
} = require("../controllers/softwareLicenseController");

// GET all software licenses
router.get("/", getAllSoftwareLicenses);

// GET software license by ID
router.get("/:id", getSoftwareLicenseById);

// POST add software license
router.post("/", addSoftwareLicense);

// PUT update software license
router.put("/:id", updateSoftwareLicense);

// DELETE software license
router.delete("/:id", deleteSoftwareLicense);

module.exports = router;