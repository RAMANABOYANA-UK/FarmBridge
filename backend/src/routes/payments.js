const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createRazorpayOrder,
  handleSuccessfulPayment,
  verifyWebhookSignature
} = require('../services/paymentService');

// ====================== INITIATE ONLINE PAYMENT FOR AN ORDER ======================
router.post(
  '/create-order/:orderId',
  protect,
  authorize('buyer'),
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.buyer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ success: false, message: 'Order already paid' });
      }

      const razorpayOrder = await createRazorpayOrder(order.totalAmount, order.orderId, {
        farmbridge_order_id: order._id.toString(),
        orderId: order.orderId,
        buyer: order.buyer.toString(),
        farmer: order.farmer.toString()
      });

      order.razorpayOrderId = razorpayOrder.id;
      order.paymentMethod = 'online';
      await order.save();

      res.json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID // frontend needs this to open checkout
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ====================== VERIFY PAYMENT AFTER CHECKOUT COMPLETES ======================
router.post(
  '/verify',
  protect,
  [
    body('razorpay_order_id').notEmpty(),
    body('razorpay_payment_id').notEmpty(),
    body('razorpay_signature').notEmpty(),
    body('orderId').notEmpty()
  ],
  validate,
  async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

      const order = await handleSuccessfulPayment({
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      // Notify both sides in real time
      const io = req.app.get('io');
      if (io) {
        io.to(`order_${order._id}`).emit('order_status', order);
        io.to(`farmer_${order.farmer}`).emit('payment_received', order);
        io.to(`buyer_${order.buyer}`).emit('payment_received', order);
      }

      res.json({ success: true, message: 'Payment verified successfully', order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// ====================== RAZORPAY WEBHOOK (server-to-server backup) ======================
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    if (!verifyWebhookSignature(body, signature)) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    if (body.event === 'payment.captured') {
      const payment = body.payload?.payment?.entity;
      const notes = payment?.notes || {};

      if (notes.farmbridge_order_id) {
        // Webhook signature is already verified above
        await handleSuccessfulPayment({
          orderId: notes.farmbridge_order_id,
          razorpay_order_id: payment.order_id,
          razorpay_payment_id: payment.id,
          razorpay_signature: 'webhook'
        });
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('[Payments] Webhook error:', error.message);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
