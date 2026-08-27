const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { sendPaymentSuccess } = require('./notificationService');

let _razorpay = null;

// Lazily initialize so the server can boot even before keys are configured
const getRazorpay = () => {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return _razorpay;
};

// Create a Razorpay order for a given amount (in rupees)
const createRazorpayOrder = async (amountInRupees, receiptId, notes = {}) => {
  const options = {
    amount: Math.round(amountInRupees * 100), // paise
    currency: 'INR',
    receipt: receiptId,
    payment_capture: 1
  };

  // Notes let us map webhook events back to our internal order
  if (Object.keys(notes).length > 0) {
    options.notes = notes;
  }

  const razorpayOrder = await getRazorpay().orders.create(options);
  return razorpayOrder;
};

// Verify the payment signature sent back after checkout
const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  return generatedSignature === razorpay_signature;
};

// Verify webhook signature (for server-to-server events like refunds)
const verifyWebhookSignature = (body, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
    .update(JSON.stringify(body))
    .digest('hex');

  return expectedSignature === signature;
};

/**
 * Handle a successful payment – verifies the checkout signature,
 * marks the order as paid (idempotent), auto-confirms pending orders
 * and fires notifications.
 */
const handleSuccessfulPayment = async ({
  orderId,              // our MongoDB order _id
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
}) => {
  const isValid = verifyPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  });

  if (!isValid) {
    throw new Error('Invalid payment signature');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  // Idempotency – don't process the same payment twice
  if (order.paymentStatus === 'paid') {
    return order;
  }

  // Ensure the Razorpay order actually belongs to this order
  if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
    throw new Error('Payment does not match this order');
  }

  order.paymentStatus = 'paid';
  order.paymentMethod = 'online';
  order.razorpayOrderId = razorpay_order_id;
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;

  // Auto-confirm the order once payment is received
  if (order.status === 'pending') {
    order.status = 'confirmed';
    order.tracking.push({
      status: 'confirmed',
      note: 'Payment received – order confirmed',
      timestamp: new Date()
    });
  } else {
    order.tracking.push({ status: order.status, note: 'Payment received' });
  }

  await order.save();

  // Fire-and-forget notification (never blocks/fails the payment flow)
  sendPaymentSuccess(order).catch((err) =>
    console.error('[PaymentService] Payment success notification failed:', err.message)
  );

  return order;
};

module.exports = {
  getRazorpay,
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  handleSuccessfulPayment
};
