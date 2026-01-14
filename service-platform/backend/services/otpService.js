const crypto = require('crypto');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/sendEmail');

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string}
 */
const generateOTPCode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

/**
 * Create and save OTP to database
 * @param {string} email 
 * @returns {Promise<string>} The generated OTP code
 */
const createOTP = async (email) => {
    const otpCode = generateOTPCode();
    await OTP.create({ email, code: otpCode });
    return otpCode;
};

/**
 * Send OTP via email
 * @param {string} email 
 * @param {string} otpCode 
 */
const sendOTPEmail = async (email, otpCode) => {
    await sendEmail({
        email,
        subject: 'Your Verification Code',
        message: `Your verification code is: ${otpCode}. It will expire in 5 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px;">
                <h2 style="color: #4f46e5;">Verification Code</h2>
                <p>Hello,</p>
                <p>Your verification code for the Super Intelligent Platform is:</p>
                <div style="font-size: 32px; font-weight: bold; color: #4f46e5; margin: 20px 0; letter-spacing: 5px;">${otpCode}</div>
                <p>This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `
    });
};

/**
 * Verify OTP code
 * @param {string} email 
 * @param {string} code 
 * @returns {Promise<boolean>}
 */
const verifyOTPCode = async (email, code) => {
    const otpRecord = await OTP.findOne({ email, code }).sort({ createdAt: -1 });

    if (!otpRecord) {
        return false;
    }

    // Delete after successful verification (or let TTL handle it)
    await OTP.deleteOne({ _id: otpRecord._id });
    return true;
};

module.exports = {
    createOTP,
    sendOTPEmail,
    verifyOTPCode
};
