const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();



const User = require('../models/user');

// Authentication route to generate JWT
router.post('/auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email (you may need to adjust the field names)
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // User not found
      return res.status(401).json({ message: 'Authentication failed, user not found' });
    }

    // Verify the password (using bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Invalid password
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // If authentication is successful, generate a JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_HOURS, // Token expires in 720 hours (adjust as needed)
      }
    );

    res.json({ token });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
