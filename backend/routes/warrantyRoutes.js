const express = require('express');

const router = express.Router();

const {
    getAllWarranties,
    getWarrantyById,
    createWarranty,
    updateWarranty,
    deleteWarranty
} = require('../controllers/warrantyController');

// Get all warranties
router.get('/', getAllWarranties);

// Get warranty by ID
router.get('/:id', getWarrantyById);

// Add warranty
router.post('/', createWarranty);

// Update warranty
router.put('/:id', updateWarranty);

// Delete warranty
router.delete('/:id', deleteWarranty);

module.exports = router;