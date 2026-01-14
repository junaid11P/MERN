const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus } = require('../controllers/bookingController');

router.post('/create', createBooking);
router.post('/update-status', updateBookingStatus);

module.exports = router;
