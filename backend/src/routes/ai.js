const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { calculateExportReadiness } = require('../services/exportStatusService');
const Product = require('../models/Product');

// Get export readiness for a product
router.get('/export-readiness/:productId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const result = calculateExportReadiness(product);

    // Optionally save it back
    product.exportReadiness = result;
    await product.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Placeholder for demand forecast
router.get('/demand-forecast', protect, async (req, res) => {
  res.json({
    message: 'Demand forecasting will be implemented in Phase 2/3',
    sample: { tomato: 'High demand next 7 days', onion: 'Moderate' }
  });
});

module.exports = router;