const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getFarmerDashboardStats } = require('../services/analyticsService');

router.get('/farmer/dashboard', protect, authorize('farmer'), async (req, res) => {
  try {
    const stats = await getFarmerDashboardStats(req.user._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;