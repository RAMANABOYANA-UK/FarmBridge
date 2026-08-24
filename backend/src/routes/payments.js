const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/paymentService');

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

      const razorpayOrder = await createRazorpayOrder(order.totalAmount, order.orderId);

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

      const isValid = verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Ensure the Razorpay order actually belongs to this order
      if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({ success: false, message: 'Payment does not match this order' });
      }

      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      order.tracking.push({ status: order.status, note: 'Payment received' });
      await order.save();

      // Notify both sides in real time
      const io = req.app.get('io');
      if (io) {
        io.to(`order_${order._id}`).emit('order_status', order);
        io.to(`farmer_${order.farmer}`).emit('payment_received', order);
      }

      res.json({ success: true, message: 'Payment verified successfully', order });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
