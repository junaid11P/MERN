const otpService = require('../services/otpService');

/**
 * Send OTP to user email
 */
const sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const otpCode = await otpService.createOTP(email);

        try {
            await otpService.sendOTPEmail(email, otpCode);
        } catch (emailError) {
            console.warn('Email sending failed, falling back to console log for development.');
            console.log(`[DEV ONLY] OTP for ${email}: ${otpCode}`);

            if (process.env.NODE_ENV !== 'development' && !process.env.ALLOW_EMAIL_FAIL) {
                throw emailError;
            }
        }

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('OTP Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

/**
 * Verify OTP provided by user
 */
const verifyOTP = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    try {
        const isValid = await otpService.verifyOTPCode(email, code);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({ success: false, message: 'OTP verification failed' });
    }
};

module.exports = { sendOTP, verifyOTP };
