const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  quantity: { type: Number, required: true },
  pricePerUnit: Number,
  total: Number
});

const orderSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true },
    orderId: { type: String, unique: true }, // human readable
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    platformFee: { type: Number, default: 0 },
    farmerAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ready_for_pickup', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: { type: String, enum: ['upi', 'cod', 'bank', 'online'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    deliveryAddress: {
      full: String,
      pincode: String,
      coordinates: { type: [Number] }
    },
    tracking: [
      {
        status: String,
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String
  },
  { timestamps: true }
);

orderSchema.index({ tenantId: 1, status: 1 });
orderSchema.index({ farmer: 1, createdAt: -1 });
orderSchema.index({ buyer: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);