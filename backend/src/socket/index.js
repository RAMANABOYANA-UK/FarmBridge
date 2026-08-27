// Socket.io event wiring for FarmBridge real-time features
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerSocketHandlers = (io) => {
  // Best-effort JWT authentication for sockets.
  // When a valid token is supplied in the handshake (`auth.token`) we attach the
  // resolved user to `socket.user`. The connection is deliberately NOT blocked so
  // demo / unauthenticated clients (e.g. the demo login) keep working — the token
  // is still validated whenever a real JWT from /api/auth is available.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (token && token !== 'demo-token-123') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) socket.user = user;
      }
    } catch (err) {
      // Invalid/expired token — leave socket.user unset, keep connection open
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a role-specific room (user_<id>)
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined user room ${userId}`);
    });

    // Join a specific order room to receive status updates
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Socket ${socket.id} joined order room ${orderId}`);
    });

    // Leave a specific order room
    socket.on('leave_order', (orderId) => {
      socket.leave(`order_${orderId}`);
      console.log(`Socket ${socket.id} left order room ${orderId}`);
    });

    // A farmer can join their incoming-order room
    socket.on('join_farmer', (farmerId) => {
      socket.join(`farmer_${farmerId}`);
      console.log(`Socket ${socket.id} joined farmer room ${farmerId}`);
    });

    // A buyer can join their own room for notifications
    socket.on('join_buyer', (buyerId) => {
      socket.join(`buyer_${buyerId}`);
      console.log(`Socket ${socket.id} joined buyer room ${buyerId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = registerSocketHandlers;
