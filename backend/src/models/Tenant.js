const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: String,
    primaryColor: { type: String, default: '#16a34a' },
    isActive: { type: Boolean, default: true },
    settings: {
      allowCOD: { type: Boolean, default: true },
      maxDeliveryRadiusKm: { type: Number, default: 15 },
      platformFeePercent: { type: Number, default: 5 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);