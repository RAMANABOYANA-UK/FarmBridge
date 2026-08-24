const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// ====================== GET MY PROFILE ======================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ====================== UPDATE PROFILE (name, address, location, language) ======================
router.put(
  '/me',
  protect,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('language').optional().isString(),
    body('location.coordinates').optional().isArray({ min: 2, max: 2 })
  ],
  validate,
  async (req, res) => {
    try {
      const allowedFields = ['name', 'email', 'language', 'address', 'location', 'profilePhoto'];
      const updates = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true
      }).select('-password');

      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ====================== UPDATE BANK / UPI DETAILS (farmer payouts) ======================
router.put(
  '/bank-details',
  protect,
  [
    body('upiId').optional().isString().trim(),
    body('accountNumber').optional().isString().trim(),
    body('ifsc').optional().isString().trim().isLength({ min: 11, max: 11 }).withMessage('IFSC must be 11 characters')
  ],
  validate,
  async (req, res) => {
    try {
      const { upiId, accountNumber, ifsc } = req.body;

      if (!upiId && !(accountNumber && ifsc)) {
        return res.status(400).json({
          success: false,
          message: 'Provide either a UPI ID or both account number and IFSC'
        });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.bankDetails = {
        ...user.bankDetails,
        ...(upiId !== undefined && { upiId }),
        ...(accountNumber !== undefined && { accountNumber }),
        ...(ifsc !== undefined && { ifsc })
      };

      await user.save();

      res.json({
        success: true,
        message: 'Bank details updated successfully',
        bankDetails: user.bankDetails
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ====================== GET BANK DETAILS ======================
router.get('/bank-details', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('bankDetails');
    res.json({ success: true, bankDetails: user.bankDetails || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ====================== GET PUBLIC PROFILE (for buyer viewing a farmer) ======================
router.get('/:id/public', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name role rating ratingCount profilePhoto location address.place');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
