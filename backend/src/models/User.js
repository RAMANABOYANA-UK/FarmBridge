const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ['farmer', 'buyer', 'admin', 'fpo_admin'], required: true },
    language: { type: String, default: 'en' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    address: {
      full: String,
      pincode: String,
      place: String
    },
    bankDetails: {
      accountNumber: String,
      upiId: String,
      ifsc: String
    },
    profilePhoto: String,
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Geospatial index
userSchema.index({ location: '2dsphere' });
userSchema.index({ phone: 1, tenantId: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);