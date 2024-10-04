const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../model/user');

const router = express.Router();

// POST /request-password-reset
const resetPassWord=async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { username: email } });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expirationDate = Date.now() + 3600000; // 1 hour expiration

    // Save token and expiration date in the database
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expirationDate;
    await user.save();

    // Send email with the token (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
        user: 'youremail@gmail.com', // Your email
        pass: 'yourpassword', // Your password
      },
    });

    const resetLink = `http://yourapp.com/reset-password/${token}`;
    const mailOptions = {
      to: user.username, // Assuming username is the email
      from: 'passwordreset@yourapp.com',
      subject: 'Password Reset',
      text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Reset link sent');
    });
  } catch (err) {
    res.status(500).send('Error requesting password reset');
  }
};



const bcrypt = require('bcryptjs');

// POST /reset-password/:token
const newPassWord=async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: Date.now(), // Check if the token is not expired
        },
      },
    });

    if (!user) {
      return res.status(400).send('Invalid or expired token.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear the reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).send('Password has been successfully reset.');
  } catch (err) {
    res.status(500).send('Error resetting password');
  }
};

module.exports = router;

module.exports = {
    resetPassWord,
    newPassWord,
};
