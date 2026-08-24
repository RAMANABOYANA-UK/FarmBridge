const Razorpay = require('razorpay');
const crypto = require('crypto');

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
const createRazorpayOrder = async (amountInRupees, receiptId) => {
  const options = {
    amount: Math.round(amountInRupees * 100), // paise
    currency: 'INR',
    receipt: receiptId,
    payment_capture: 1
  };

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

module.exports = { getRazorpay, createRazorpayOrder, verifyPaymentSignature, verifyWebhookSignature };
