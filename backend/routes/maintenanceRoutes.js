const express = require("express");

const router = express.Router();

const {
    getAllMaintenance,
    getMaintenanceById,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance
} = require("../controllers/maintenanceController");


// GET all maintenance records
router.get("/", getAllMaintenance);

// GET maintenance record by ID
router.get("/:id", getMaintenanceById);

// POST add maintenance record
router.post("/", addMaintenance);

// PUT update maintenance record
router.put("/:id", updateMaintenance);

// DELETE maintenance record
router.delete("/:id", deleteMaintenance);


module.exports = router;