const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// This would typically use a service like Twilio for SMS
// For demonstration purposes, we'll just log the messages

// @route   POST /api/sms/send
// @desc    Send SMS reminder
// @access  Private
router.post('/send', auth, async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ message: 'Phone number and message are required' });
    }
    
    // In a real implementation, you would use Twilio or another SMS service here
    // For example with Twilio:
    /*
    const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */
    
    // For now, just log the message
    console.log(`SMS would be sent to ${phone}: ${message}`);
    
    res.status(200).json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
});

// @route   POST /api/sms/reminder
// @desc    Send medicine reminder SMS
// @access  Private
router.post('/reminder', auth, async (req, res) => {
  try {
    const { userId, medicineName, dosage, time } = req.body;
    
    // Validate inputs
    if (!userId || !medicineName) {
      return res.status(400).json({ message: 'User ID and medicine name are required' });
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has SMS notifications enabled and has a phone number
    if (!user.smsNotifications || !user.phone) {
      return res.status(400).json({ 
        message: 'User has not enabled SMS notifications or has no phone number' 
      });
    }
    
    const message = `Dear ${user.name}, it's time to take your medicine ${medicineName} ${dosage ? `(${dosage})` : ''} at ${time}. Please click on the link to confirm you've taken your medicine: http://localhost:5000/medicine-taken/${userId}/${medicineName}. Stay healthy! - Team Medicine Remainder`;
    
    // In a real implementation, you would use Twilio or another SMS service here
    // For example with Twilio:
    /*
    const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phone
    });
    */
    
    // For now, just log the message
    console.log(`SMS would be sent to ${user.phone}: ${message}`);
    
    res.status(200).json({ message: 'Reminder SMS sent successfully' });
  } catch (error) {
    console.error('Error sending reminder SMS:', error);
    res.status(500).json({ message: 'Failed to send reminder SMS' });
  }
});

module.exports = router;