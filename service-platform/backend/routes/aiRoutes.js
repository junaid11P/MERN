const express = require('express');
const router = express.Router();
const { handleUserQuery } = require('../controllers/aiController');

router.post('/query', handleUserQuery);

module.exports = router;
