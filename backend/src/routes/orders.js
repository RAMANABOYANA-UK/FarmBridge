const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOrder, updateOrderStatus } = require('../services/orderService');
const Order = require('../models/Order');

// Create order
router.post('/', protect, authorize('buyer'), async (req, res) => {
  try {
    const order = await createOrder({
      buyerId: req.user._id,
      farmerId: req.body.farmerId,
      items: req.body.items,
      deliveryAddress: req.body.deliveryAddress,
      paymentMethod: req.body.paymentMethod || 'cod',
      tenantId: req.user.tenantId
    });

    // Real-time notify the farmer's order room
    const io = req.app.get('io');
    if (io) {
      io.to(`farmer_${order.farmer}`).emit('new_order', order);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update status (farmer or admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const order = await updateOrderStatus(
      req.params.id,
      req.body.status,
      req.user._id,
      req.body.note
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('order_status', order);
      io.to(`farmer_${order.farmer}`).emit('order_status', order);
      io.to(`buyer_${order.buyer}`).emit('order_status', order);
      // Canonical event name used by the frontend Socket context
      io.to(`order_${order._id}`).emit('order_status_updated', order);
      io.to(`farmer_${order.farmer}`).emit('order_status_updated', order);
      io.to(`buyer_${order.buyer}`).emit('order_status_updated', order);
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get my orders
router.get('/my', protect, async (req, res) => {
  const filter = req.user.role === 'farmer'
    ? { farmer: req.user._id }
    : { buyer: req.user._id };

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate('items.product', 'name images')
    .populate('buyer', 'name phone')
    .populate('farmer', 'name phone');

  res.json(orders);
});

// Get single order by :id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone')
      .populate('farmer', 'name phone')
      .populate('items.product', 'name images');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner =
      order.buyer._id.toString() === req.user._id.toString() ||
      order.farmer._id.toString() === req.user._id.toString() ||
      ['admin', 'fpo_admin'].includes(req.user.role);

    if (!isOwner) return res.status(403).json({ message: 'Not authorized to view this order' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;