const Order = require('../models/Order');
const Product = require('../models/Product');
const generateOrderId = require('../utils/generateOrderId');

const createOrder = async ({ buyerId, farmerId, items, deliveryAddress, paymentMethod, tenantId }) => {
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      throw new Error(`Product ${item.productId} not available`);
    }
    if (product.availableQuantity < item.quantity) {
      throw new Error(`Insufficient quantity for ${product.name}`);
    }

    const lineTotal = product.pricePerUnit * item.quantity;
    totalAmount += lineTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      pricePerUnit: product.pricePerUnit,
      total: lineTotal
    });

    // Reduce stock
    product.availableQuantity -= item.quantity;
    await product.save();
  }

  const platformFeePercent = 5; // later from tenant settings
  const platformFee = Math.round((totalAmount * platformFeePercent) / 100);
  const farmerAmount = totalAmount - platformFee;

  const order = await Order.create({
    tenantId,
    orderId: generateOrderId(),
    buyer: buyerId,
    farmer: farmerId,
    items: orderItems,
    totalAmount,
    platformFee,
    farmerAmount,
    paymentMethod,
    deliveryAddress,
    tracking: [{ status: 'pending', note: 'Order placed' }]
  });

  // Fire-and-forget notification (never blocks/fails the order flow)
  const { sendOrderPlaced } = require('./notificationService');
  sendOrderPlaced(order).catch((err) =>
    console.error('[OrderService] Order placed notification failed:', err.message)
  );

  return order;
};

const updateOrderStatus = async (orderId, newStatus, updatedBy = null, note = '') => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  order.status = newStatus;
  order.tracking.push({ status: newStatus, note, updatedBy, timestamp: new Date() });
  if (newStatus === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus;
  }
  await order.save();

  // Fire-and-forget status notification (never blocks/fails the update)
  const { sendOrderStatusUpdate } = require('./notificationService');
  sendOrderStatusUpdate(order, newStatus).catch((err) =>
    console.error('[OrderService] Status notification failed:', err.message)
  );

  return order;
};

module.exports = { createOrder, updateOrderStatus };