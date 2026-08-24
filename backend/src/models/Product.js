const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    category: String,
    pricePerUnit: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    availableQuantity: { type: Number, required: true },
    harvestDate: { type: Date, required: true },
    expiryDate: { type: Date }, // auto-calculated or set
    images: [String],
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    qualityGrade: {
      grade: { type: String, enum: ['premium', 'standard', 'reject', 'ungraded'], default: 'ungraded' },
      confidence: Number,
      defects: [String],
      gradedAt: Date
    },
    exportReadiness: {
      score: { type: Number, default: 0 }, // 0-100
      status: { type: String, enum: ['ready', 'not_ready', 'restricted', 'unknown'], default: 'unknown' },
      reasons: [String]
    },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.index({ location: '2dsphere' });
productSchema.index({ tenantId: 1, isActive: 1 });
productSchema.index({ harvestDate: 1 });

// Auto-deactivate if past expiry
productSchema.pre('save', function (next) {
  if (this.harvestDate && !this.expiryDate) {
    // Default 48 hours freshness for leafy, longer for others – can be refined
    this.expiryDate = new Date(this.harvestDate.getTime() + 48 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);