const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadProductImages } = require('../middleware/upload');
const { gradeProduct } = require('../services/qualityService');

// ====================== CREATE PRODUCT + AUTO GRADE ======================
router.post(
  '/',
  protect,
  authorize('farmer'),
  (req, res, next) => {
    uploadProductImages(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('pricePerUnit').isNumeric().withMessage('Price must be a number'),
    body('availableQuantity').isNumeric().withMessage('Quantity must be a number'),
    body('harvestDate').isISO8601().withMessage('Valid harvest date required')
  ],
  validate,
  async (req, res) => {
    try {
      const imagePaths = req.files
        ? req.files.map((file) => `/uploads/products/${file.filename}`)
        : [];

      // Handle location (can come as JSON string in form-data)
      let location = req.body.location;
      if (typeof location === 'string') {
        try {
          location = JSON.parse(location);
        } catch (e) {
          location = { coordinates: [0, 0] };
        }
      }

      // 1. Create product first
      const product = await Product.create({
        name: req.body.name,
        description: req.body.description || '',
        category: req.body.category || 'General',
        pricePerUnit: Number(req.body.pricePerUnit),
        unit: req.body.unit || 'kg',
        availableQuantity: Number(req.body.availableQuantity),
        harvestDate: req.body.harvestDate,
        images: imagePaths,
        farmer: req.user._id,
        tenantId: req.user.tenantId || null,
        location: {
          type: 'Point',
          coordinates: location?.coordinates || [0, 0]
        }
      });

      // 2. Auto quality grading using CNN
      if (imagePaths.length > 0) {
        try {
          const gradeResult = await gradeProduct(imagePaths);

          product.qualityGrade = {
            grade: gradeResult.grade || 'ungraded',
            confidence: gradeResult.confidence || 0,
            defects: gradeResult.defects || [],
            gradedAt: new Date()
          };

          await product.save();
        } catch (gradeError) {
          console.error('Auto grading failed:', gradeError.message);
          // We still return the product even if grading fails
        }
      }

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
// ====================== NEARBY PRODUCTS (Geospatial) ======================
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 15000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const products = await Product.find({
      isActive: true,
      availableQuantity: { $gt: 0 },
      expiryDate: { $gt: new Date() },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
      .populate('farmer', 'name phone rating')
      .sort({ harvestDate: -1 })
      .limit(50);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ====================== MY PRODUCTS (Farmer) ======================
router.get('/my', protect, authorize('farmer'), async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ====================== GET SINGLE PRODUCT ======================
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name phone rating location');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// ====================== UPDATE PRODUCT ======================
router.put('/:id', protect, authorize('farmer'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ====================== SOFT DELETE ======================
router.delete('/:id', protect, authorize('farmer'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    product.isActive = false;
    await product.save();

    res.json({ success: true, message: 'Product deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===================== MANUAL RE-GRADE ======================
router.post('/:id/regrade', protect, authorize('farmer'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (!product.images || product.images.length === 0) {
      return res.status(400).json({ success: false, message: 'No images available for grading' });
    }

    const gradeResult = await gradeProduct(product.images);

    product.qualityGrade = {
      grade: gradeResult.grade || 'ungraded',
      confidence: gradeResult.confidence || 0,
      defects: gradeResult.defects || [],
      gradedAt: new Date()
    };

    await product.save();

    res.json({
      success: true,
      message: 'Product re-graded successfully',
      qualityGrade: product.qualityGrade
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;