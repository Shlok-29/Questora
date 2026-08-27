const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const User = require('../models/User');

// Twilio Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = (accountSid && accountSid.startsWith('AC') && authToken) ? twilio(accountSid, authToken) : null;

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Route: Send OTP
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update or create user
    await User.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpires, isVerified: false },
      { upsert: true, new: true }
    );

    console.log(`OTP for ${phoneNumber}: ${otp}`);

    if (client && twilioPhone) {
      await client.messages.create({
        body: `Your WeekendWander verification code is: ${otp}`,
        from: twilioPhone,
        to: phoneNumber
      });
      res.json({ message: 'OTP sent successfully' });
    } else {
      // For development when keys are missing
      res.json({ 
        message: 'OTP generated (Dev Mode)', 
        otp: otp, // Sending back OTP only for dev mode if keys are missing
        warning: 'Twilio keys missing, OTP logged to console.' 
      });
    }
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Route: Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { phoneNumber: user.phoneNumber }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
