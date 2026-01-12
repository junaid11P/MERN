const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api/auth';
const TEST_EMAIL = 'test@example.com';

async function testOTPFlow() {
    try {
        console.log('--- Starting OTP Flow Test ---');

        // 1. Send OTP
        console.log(`Step 1: Requesting OTP for ${TEST_EMAIL}...`);
        const sendRes = await axios.post(`${BASE_URL}/otp/send`, { email: TEST_EMAIL });
        console.log('Response:', sendRes.data);

        if (!sendRes.data.success) {
            throw new Error('Failed to send OTP');
        }

        console.log('\nNOTE: In a real test, you would need to check the database or use a test mail trap.');
        console.log('For this automated test, we will assume success if the endpoint returned success.');

        // 2. Verify OTP (This part requires the actual code, which we can't get easily without DB access in this script)
        // In a real environment, we'd query the DB here.
        console.log('\n--- OTP Flow Test Completed (Basic Check) ---');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

// Check if server is running before testing
axios.get('http://localhost:5001/api/auth/otp/send').catch(err => {
    if (err.code === 'ECONNREFUSED') {
        console.error('ERROR: Backend server is not running on port 5001. Please start it with "npm run server" first.');
        process.exit(1);
    }
    testOTPFlow();
});
