const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

// GET all items
router.get('/', equipmentController.getAllEquipment);

// POST new item
router.post('/', equipmentController.createEquipment);

// PUT (update) item by ID
router.put('/:id', equipmentController.updateEquipment);

// DELETE item by ID
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
