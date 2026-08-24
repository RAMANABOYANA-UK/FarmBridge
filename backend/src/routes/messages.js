const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const Message = require('../models/Message');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Helper: verify the current user is either buyer or farmer of the order
const assertOrderParticipant = async (orderId, userId) => {
  const order = await Order.findById(orderId).select('buyer farmer');
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  const isBuyer = order.buyer.toString() === userId.toString();
  const isFarmer = order.farmer.toString() === userId.toString();

  if (!isBuyer && !isFarmer) {
    const err = new Error('Not authorized to access this conversation');
    err.statusCode = 403;
    throw err;
  }

  return order;
};

// ====================== UNREAD COUNT (global for current user) ======================
// NOTE: registered BEFORE /:orderId so "unread" is never treated as an orderId
router.get('/unread', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });

    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ====================== GET CONVERSATION ======================
// GET /api/messages/:orderId?page=1&limit=30
router.get(
  '/:orderId',
  protect,
  [
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validate,
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 30;
      const skip = (page - 1) * limit;

      await assertOrderParticipant(orderId, req.user._id);

      const [messages, total] = await Promise.all([
        Message.find({ order: orderId })
          .sort({ createdAt: 1 }) // oldest first (chat style)
          .skip(skip)
          .limit(limit)
          .populate('sender', 'name profilePhoto role')
          .populate('receiver', 'name profilePhoto role')
          .lean(),
        Message.countDocuments({ order: orderId })
      ]);

      res.json({
        success: true,
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }
);

// ====================== SEND MESSAGE ======================
// POST /api/messages
router.post(
  '/',
  protect,
  [
    body('orderId').isMongoId().withMessage('Valid orderId is required'),
    body('text')
      .trim()
      .notEmpty()
      .withMessage('Message text is required')
      .isLength({ max: 2000 })
      .withMessage('Message too long (max 2000 characters)')
  ],
  validate,
  async (req, res) => {
    try {
      const { orderId, text } = req.body;
      const senderId = req.user._id;

      const order = await assertOrderParticipant(orderId, senderId);

      // Determine receiver
      const receiverId =
        order.buyer.toString() === senderId.toString()
          ? order.farmer
          : order.buyer;

      const message = await Message.create({
        order: orderId,
        sender: senderId,
        receiver: receiverId,
        text
      });

      // Populate for response + socket
      await message.populate([
        { path: 'sender', select: 'name profilePhoto role' },
        { path: 'receiver', select: 'name profilePhoto role' }
      ]);

      // Real-time emit
      const io = req.app.get('io');
      if (io) {
        // Emit to the order room (both parties should be in it)
        io.to(`order_${orderId}`).emit('new_message', message);

        // Personal notification to the receiver
        io.to(`user_${receiverId}`).emit('message_notification', {
          orderId,
          message
        });
      }

      res.status(201).json({
        success: true,
        message
      });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }
);

// ====================== MARK AS READ ======================
// PUT /api/messages/:orderId/read
router.put(
  '/:orderId/read',
  protect,
  [param('orderId').isMongoId().withMessage('Invalid order ID')],
  validate,
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;

      await assertOrderParticipant(orderId, userId);

      const result = await Message.updateMany(
        {
          order: orderId,
          receiver: userId,
          read: false
        },
        {
          $set: { read: true, readAt: new Date() }
        }
      );

      // Optionally notify the other side that messages were read
      const io = req.app.get('io');
      if (io) {
        io.to(`order_${orderId}`).emit('messages_read', {
          orderId,
          readBy: userId,
          count: result.modifiedCount
        });
      }

      res.json({
        success: true,
        message: 'Messages marked as read',
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
