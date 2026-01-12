const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const {
    registerUser,
    loginUser,
    registerProvider,
    loginProvider
} = require('../controllers/authController');

// OTP Routes
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);

// User Auth Routes
router.post('/user/signup', registerUser);
router.post('/user/login', loginUser);

// Provider Auth Routes
router.post('/provider/signup', registerProvider);
router.post('/provider/login', loginProvider);

module.exports = router;
