const express = require('express');

const router = express.Router();

const {
    getAllWarranties,
    getWarrantyById,
    createWarranty,
    updateWarranty,
    deleteWarranty
} = require('../controllers/warrantyController');

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const canManage = authorizeRole("Admin");

router.get('/', authMiddleware, canManage, getAllWarranties);
router.get('/:id', authMiddleware, canManage, getWarrantyById);
router.post('/', authMiddleware, canManage, createWarranty);
router.put('/:id', authMiddleware, canManage, updateWarranty);
router.delete('/:id', authMiddleware, canManage, deleteWarranty);

module.exports = router;