const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
    body('role').isIn(['farmer', 'buyer']).withMessage('Role must be farmer or buyer'),
    body('password').optional().isLength({ min: 6 })
  ],
  validate,
  async (req, res) => {
    try {
      const { name, phone, email, password, role, language, location, address, tenantId } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ phone, tenantId: tenantId || null });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this phone number' });
      }

      const user = await User.create({
        name,
        phone,
        email,
        password,
        role,
        language: language || 'en',
        location: location || { type: 'Point', coordinates: [0, 0] },
        address,
        tenantId: tenantId || null
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          language: user.language
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { phone, password, tenantId } = req.body;

      const user = await User.findOne({ phone, tenantId: tenantId || null });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid phone or password' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          language: user.language,
          location: user.location
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;