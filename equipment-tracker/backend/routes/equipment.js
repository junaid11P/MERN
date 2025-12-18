const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

// GET /api/equipment
router.get('/', equipmentController.getAllEquipment);

// POST /api/equipment
router.post('/', equipmentController.createEquipment);

// PUT /api/equipment/:id
router.put('/:id', equipmentController.updateEquipment);

// DELETE /api/equipment/:id
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
