const User = require('../models/User');
const {
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
  sendOrderStatusEmail
} = require('./emailService');
const {
  sendOrderConfirmationWhatsApp,
  sendPaymentSuccessWhatsApp
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
const sendOrderStatusUpdate = async (order, statusText) => {
  const buyer = await User.findById(order.buyer).select('email');
  if (buyer?.email) {
    await safeSend(sendOrderStatusEmail, buyer.email, order, statusText);
  }
};

module.exports = {
  sendOrderPlaced,
  sendPaymentSuccess,
  sendOrderStatusUpdate
};
