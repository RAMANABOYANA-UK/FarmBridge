const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sendOtp, verifyOtp } = require('../services/otpService');
const User = require('../models/User');

// ====================== SEND OTP ======================
router.post(
  '/send',
  protect,
  [
    body('purpose')
      .optional()
      .isIn(['login', 'signup', 'bank_update', 'password_reset', 'general']),
    body('channel').optional().isIn(['email', 'whatsapp'])
  ],
  validate,
  async (req, res) => {
    try {
      const purpose = req.body.purpose || 'general';
      const channel = req.body.channel || 'email';

      const user = await User.findById(req.user._id).select('email phone');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const result = await sendOtp({
        userId: user._id,
        email: user.email,
        phone: user.phone,
        purpose,
        channel
      });

      res.json(result);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }
);

// ====================== VERIFY OTP ======================
router.post(
  '/verify',
  protect,
  [
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('purpose').optional().isIn(['login', 'signup', 'bank_update', 'password_reset', 'general'])
  ],
  validate,
  async (req, res) => {
    try {
      const { otp, purpose = 'general' } = req.body;

      const result = await verifyOtp({
        userId: req.user._id,
        otp,
        purpose
      });

      res.json(result);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
