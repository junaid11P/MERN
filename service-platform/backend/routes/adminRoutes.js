const express = require('express');
const router = express.Router();
const { getDashboardStats, getProviders } = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.get('/providers', getProviders);

module.exports = router;
