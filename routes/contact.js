const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
// Note: In production, you would use actual SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP host
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'saketbarnwal468@gmail.com', // Replace with your email
    pass: 'apdb yabn pyjy dliw' // Replace with your password
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
});

// @route   POST /api/contact
// @desc    Send contact form email
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate request
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    
    // Email content
    const mailOptions = {
      from: email,
      to: 'saketbarnwal468@gmail.com', // Replace with the recipient email
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };
    
    // Send email
    // Commented out for development - would be enabled in production
    /*
    await transporter.sendMail(mailOptions);
    */
    
    // For development, just log the email content
    console.log('Email would be sent with:', mailOptions);
    
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;