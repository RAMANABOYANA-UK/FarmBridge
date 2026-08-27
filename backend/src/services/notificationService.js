const User = require('../models/User');
const {
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
  sendOrderStatusEmail
} = require('./emailService');
const {
  sendOrderConfirmationWhatsApp,
  sendPaymentSuccessWhatsApp,
  sendWhatsAppTemplate
} = require('./whatsappService');

/**
 * Safe wrapper – never throws to the caller
 */
const safeSend = async (fn, ...args) => {
  try {
    return await fn(...args);
  } catch (err) {
    console.error('[Notification] Failed:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send Order Confirmation (Email + WhatsApp)
 */
const sendOrderPlaced = async (order) => {
  const buyer = await User.findById(order.buyer).select('email phone name');
  if (!buyer) return;

  const tasks = [];

  if (buyer.email) {
    tasks.push(safeSend(sendOrderConfirmationEmail, buyer.email, order));
  }
  if (buyer.phone) {
    tasks.push(safeSend(sendOrderConfirmationWhatsApp, buyer.phone, order));
  }

  // Notify the farmer about the new order
  const farmer = await User.findById(order.farmer).select('email phone name');
  if (farmer?.email) {
    tasks.push(
      safeSend(
        sendOrderStatusEmail,
        farmer.email,
        order,
        `New order received (#${order.orderId || order._id})`
      )
    );
  }

  await Promise.allSettled(tasks);
};

/**
 * Send Payment Success
 */
const sendPaymentSuccess = async (order) => {
  const buyer = await User.findById(order.buyer).select('email phone');
  if (!buyer) return;

  const tasks = [];
  if (buyer.email) tasks.push(safeSend(sendPaymentSuccessEmail, buyer.email, order));
  if (buyer.phone) tasks.push(safeSend(sendPaymentSuccessWhatsApp, buyer.phone, order));

  await Promise.allSettled(tasks);
};

/**
 * Generic status update
 */
const sendOrderStatusUpdate = async (order, newStatus) => {
  const STATUS_MESSAGES = {
    confirmed: 'Your order has been confirmed by the farmer',
    ready_for_pickup: 'Your order is ready for pickup',
    in_transit: 'Your order is on the way',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled'
  };
  const statusText = STATUS_MESSAGES[newStatus] || `Status updated to ${newStatus}`;

  const [buyer, farmer] = await Promise.all([
    User.findById(order.buyer).select('email phone name'),
    User.findById(order.farmer).select('email phone name')
  ]);

  const tasks = [];

  // Always notify the buyer
  if (buyer?.email) {
    tasks.push(safeSend(sendOrderStatusEmail, buyer.email, order, statusText));
  }
  if (buyer?.phone) {
    tasks.push(safeSend(sendOrderStatusWhatsApp, buyer.phone, order, statusText));
  }

  // Notify the farmer only on important statuses
  if (farmer?.email && ['delivered', 'cancelled'].includes(newStatus)) {
    tasks.push(
      safeSend(
        sendOrderStatusEmail,
        farmer.email,
        order,
        `Order #${order.orderId || order._id} is now ${newStatus}`
      )
    );
  }

  await Promise.allSettled(tasks);
};

module.exports = {
  sendOrderPlaced,
  sendPaymentSuccess,
  sendOrderStatusUpdate
};
