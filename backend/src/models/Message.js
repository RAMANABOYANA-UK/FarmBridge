const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// Compound index for fast conversation queries
messageSchema.index({ order: 1, createdAt: 1 });
messageSchema.index({ receiver: 1, read: 1 }); // for unread counts

module.exports = mongoose.model('Message', messageSchema);
